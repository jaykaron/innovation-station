import { BotEvent, isResource, MedplumClient } from '@medplum/core';
import { Communication, Patient, Reference, RelatedPerson } from '@medplum/fhirtypes';

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

        await Promise.all([medplum.updateResource({
            ...communcation,
            note: [{
                text: "Bot has processed this message",
                time: new Date().toISOString(),
                authorReference: botReference
            }]
        }),
        medplum.createResource(commicationResponse)]);
        console.log("Response created");
        return true
    }
    return false;
}
