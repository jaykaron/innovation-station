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
        const communcationWithNotes = await augmentCommunication(communcation, event, botReference);
        await Promise.all([
            medplum.updateResource(communcationWithNotes),
            medplum.createResource(commicationResponse)
        ]);

        console.log("Response created");
        return true
    }
    return false;
}

async function augmentCommunication(communcation: Communication, event: BotEvent, botReference: Reference<RelatedPerson>): Promise<Communication> {
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
            const summary = await claude.summarizePatientMessage(contentString);
            const notes = communcation.note ?? [];
            notes.push({
                text: "AI Generated Summary:\n\n" + summary.content[0].text,
                time: new Date().toISOString(),
                authorReference: botReference
            });
            communcation.note = notes;
        }
        return communcation;

}