import { Bot, Communication, Reference } from '@medplum/fhirtypes';
import { MockClient } from '@medplum/mock';
import { expect, test, beforeEach, afterEach } from 'vitest';
import { handler, IClaudeClient, setClaudeClientFactory, resetClaudeClientFactory } from './watch-communication';

const medplum = new MockClient();

const exampleCommunication: Communication = {
  "resourceType": "Communication",
  "status": "in-progress",
  "sender": {
    "reference": "Patient/019529a0-a067-73e8-8317-cd1e86008386",
    "display": "Mr JPatient KPatient"
  },
  "subject": {
    "reference": "Patient/019529a0-a067-73e8-8317-cd1e86008386",
    "display": "Mr JPatient KPatient"
  },
  "recipient": [
    {
      "reference": "Practitioner/0194d711-4e3b-75ee-8247-82b9dec81d17",
      "display": "Jay Karon"
    }
  ],
  "sent": "2025-02-21T19:15:40.698Z",
  "payload": [{ "contentString": "Hi Dr. I've been having a lot of pain in my right arm. What should I do?" }],
  "id": "019529ef-dec4-778f-8bae-43d695c63b8d",
  "meta": {
    "versionId": "019529ef-dec5-7250-a3d4-90635a258ad4",
    "lastUpdated": "2025-02-21T19:15:40.869Z",
    "author": {
      "reference": "Patient/019529a0-a067-73e8-8317-cd1e86008386",
      "display": "Mr JPatient KPatient"
    },
    "project": "0194d704-b441-7479-9ba4-0a346c44b3d9",
    "compartment": [
      { "reference": "Project/0194d704-b441-7479-9ba4-0a346c44b3d9" },
      { "reference": "Patient/019529a0-a067-73e8-8317-cd1e86008386" }
    ]
  }
};

// Create a mock Claude client
const mockClaudeClient: IClaudeClient = {
  getPatientMessageSummary: vi.fn().mockResolvedValue({ content: [{ text: 'Mock summary' }] }),
  getUserMessageFromPrompt: vi.fn().mockResolvedValue({ content: [{ text: 'Mock analysis' }] }),
  getPriorityFromPatientMessage: vi.fn().mockResolvedValue({ content: [{ text: 'routine' }] }),
  getCommunicationTopicFromPatientMessage: vi.fn().mockResolvedValue({ content: [{ text: 'progress-update' }] })
};

beforeEach(() => {
  // Set up the mock factory before each test
  setClaudeClientFactory(() => mockClaudeClient);
});

afterEach(() => {
  // Reset the factory after each test
  resetClaudeClientFactory();
  vi.clearAllMocks();
});

test('Non-communication resource returns false', async () => {
  const bot: Reference<Bot> = { reference: 'Bot/123' };
  const input = { resourceType: 'Patient' };
  const contentType = 'application/fhir+json';
  const secrets = {};
  const result = await handler(medplum, { bot, input, contentType, secrets });
  expect(result).toBe(false);
});

test('Non-patient sender returns false', async () => {
  const nonPatientComm = { ...exampleCommunication };
  nonPatientComm.sender = {
    reference: 'Practitioner/123',
    display: 'Dr Smith'
  };

  const bot: Reference<Bot> = { reference: 'Bot/123' };
  const input = nonPatientComm;
  const contentType = 'application/fhir+json';
  const secrets = {};
  const result = await handler(medplum, { bot, input, contentType, secrets });
  expect(result).toBe(false);
});

test('Creates response communication', async () => {
  const bot: Reference<Bot> = { reference: 'Bot/123' };
  const input = exampleCommunication;
  const contentType = 'application/fhir+json';
  const secrets = {};

  const result = await handler(medplum, { bot, input, contentType, secrets });

  expect(result).toBe(true);
  expect(mockClaudeClient.getPatientMessageSummary).toHaveBeenCalled();
  expect(mockClaudeClient.getUserMessageFromPrompt).toHaveBeenCalled();
  expect(mockClaudeClient.getPriorityFromPatientMessage).toHaveBeenCalled();
  expect(mockClaudeClient.getCommunicationTopicFromPatientMessage).toHaveBeenCalled();
});
