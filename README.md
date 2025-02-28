# WELL AI Hackathon 2025 - Team Innovation Station
Team members:
* Bruce McLavy (Microquest)
* Colin Tong (Insig)
* Jay Karon (OceanMD)

## Overview
A Medplum bot to augment incoming patient communcations using an LLM

## Pieces
* Medplum (WELL instance). (A lot of manual configuartion required to set up permissions, bots, users, etc.)
* `foomedical/`: Medplum example patient facing app to send messages. Modified slightly
* `provider`: Medplum example provider facing app to view patients and received messages
* `my-bots`: Medplum bots example repo. Deleted all bots except `hello-patient`. Added new bot `watch-communication`

## To run:
* Create a medplum bot with the executable code `watch-communication.js` from `npm run build`
* Set your Anthropic API key as a project secret
* Create a Subscription to watch for creation of Communication resources
* Run `foomedical` (`npm run dev`)
* Run `provider` (`npm run dev`)
* Create a `User` and associate it with a Patient using `ProjectMembership`
* Login to `foomedical` as the patient and send a message

