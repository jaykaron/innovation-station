import { BotEvent, isResource, MedplumClient } from '@medplum/core';
import { Communication, Patient, Reference, RelatedPerson } from '@medplum/fhirtypes';
import { ClaudeClient } from './claude';

// See test file for example Communication resource

export async function handler(medplum: MedplumClient, event: BotEvent): Promise<any> {
    if (isResource(event.input, "Communication")) {
        console.log("Communication received");
        const communcation = event.input as Communication;
        if (!communcation.sender?.reference?.startsWith?.("Patient")) {
            console.log("Sender is not a Patient");
            return false;
        }

        const patientMessage = communcation.payload?.[0]?.contentString || '';
        console.log("Patient message:", patientMessage);

        // Get patient data
        const patientBundle = await medplum.readPatientEverything(communcation.sender.reference.split("/")[1]);
        const relevantData = extractRelevantPatientData(patientBundle);

        // Get AI analysis of patient data
        const analysisPrompt = createAnalysisPrompt(patientMessage, relevantData);
        //const analysis = await getAIAnalysis(analysisPrompt); 

        const botReference : Reference<RelatedPerson> =  {
            reference: event.bot.reference,
            display: event.bot.display
        };
        
        const commicationResponse : Communication = {
            resourceType: "Communication",
            status: "in-progress",
            sender: botReference,
            subject: communcation.subject,
            recipient: [communcation.sender as Reference<Patient>],
            sent: new Date().toISOString(),
            payload: [{ contentString: "Response from bot" }],
        };
        console.log("Creating response");
        const communcationWithNotes = await augmentCommunication(communcation, event, botReference, analysisPrompt);
        await Promise.all([
            medplum.updateResource(communcationWithNotes),
            medplum.createResource(commicationResponse)
        ]);

        console.log("Response created");
        return true
    }
    return false;
}

async function augmentCommunication(communcation: Communication, event: BotEvent, botReference: Reference<RelatedPerson>, analysisPrompt:string): Promise<Communication> {
    const anthropicApiKey = event.secrets.ANTHROPIC_API_KEY.valueString;
        if (!anthropicApiKey) {
            console.log("Anthropic API key not found");
            return communcation;
        }
        const claude = new ClaudeClient({
            apiKey: anthropicApiKey
        });
        const contentString = communcation.payload?.[0]?.contentString;
        if (contentString) {
            const summary = await claude.getPatientMessageSummary(contentString);
            const patientSummary = await claude.getUserMessageFromPrompt(analysisPrompt, [], contentString);
            const priority = await claude.getPriorityFromPatientMessage(contentString);
            const notes = communcation.note ?? [];
            notes.push({
                text: "AI Generated Summary:\n\n" + summary.content[0].text,
                time: new Date().toISOString(),
                authorReference: botReference
            });

            notes.push({
                text: "AI Context Generated Summary:\n\n" + patientSummary.content[0].text,
                time: new Date().toISOString(),
                authorReference: botReference
            });
            communcation.priority = priority.content[0].text;
            communcation.note = notes;
        }
        return communcation;

}

function extractRelevantPatientData(bundle:any): PatientData {
    const data:PatientData = {
        conditions: [],
        allergies: [],
        medications: [],
        observations: []
    };

    bundle.entry?.forEach((entry:any) => {
        const resource = entry.resource;
        if (!resource) {
            return;
        }

        switch (resource.resourceType) {
            case 'Condition':
                if (resource.clinicalStatus?.coding?.[0]?.code === 'active') {
                    data.conditions.push({
                        code: resource.code?.coding?.[0]?.code,
                        display: resource.code?.text || resource.code?.coding?.[0]?.display,
                        status: resource.clinicalStatus?.coding?.[0]?.code,
                        onsetDate: resource.onsetDateTime
                    });
                }
                break;

            case 'AllergyIntolerance':
                data.allergies.push({
                    substance: resource.code?.text || resource.code?.coding?.[0]?.display,
                    severity: resource.reaction?.[0]?.severity,
                    status: resource.clinicalStatus?.coding?.[0]?.code
                });
                break;

            case 'MedicationRequest':
                if (resource.status === 'active') {
                    data.medications.push({
                        medication: resource.medicationCodeableConcept?.text,
                        status: resource.status
                    });
                }
                break;

            case 'Observation':
                if (resource.status === 'final') {
                    data.observations.push({
                        type: resource.code?.text,
                        value: resource.valueQuantity?.value,
                        unit: resource.valueQuantity?.unit,
                        date: resource.effectiveDateTime
                    });
                }
                break;
        }
    });

    return data;
}
     
export interface PatientData {
    conditions: {
        code?: string;
        display?: string;
        status?: string;
        onsetDate?: string;
    }[];
    allergies: {
        substance?: string;
        severity?: string;
        status?: string;
    }[];
    medications: {
        medication?: string;
        status?: string;
    }[];
    observations: {
        type?: string;
        value?: number;
        unit?: string;
        date?: string;
    }[];
}

function createAnalysisPrompt(patientMessage: string, patientData: PatientData): string {
    return `
Please analyze this patient message in the context of their medical history.

Patient Message:
${patientMessage}

Medical Context:
${formatMedicalContext(patientData)}

Please provide any clinical relevance of their medical history to this message.  Keep it short and concise.
`;
}

function formatMedicalContext(data: PatientData): string {
    let context = '';
    
    if (data.conditions.length > 0) {
        context += '\nActive Conditions:\n';
        data.conditions.forEach(c => {
            context += `- ${c.display || c.code} (since ${c.onsetDate || 'unknown'})\n`;
        });
    }

    if (data.allergies.length > 0) {
        context += '\nAllergies:\n';
        data.allergies.forEach(a => {
            context += `- ${a.substance} (${a.severity || 'severity unknown'})\n`;
        });
    }

    if (data.medications.length > 0) {
        context += '\nCurrent Medications:\n';
        data.medications.forEach(m => {
            context += `- ${m.medication}\n`;
        });
    }

    if (data.observations.length > 0) {
        context += '\nRecent Observations:\n';
        data.observations.forEach(o => {
            context += `- ${o.type}: ${o.value} ${o.unit} (${o.date || 'date unknown'})\n`;
        });
    }

    return context;
}