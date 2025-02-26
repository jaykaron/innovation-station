import https, { request } from 'https';
import { COMMUNICATION_TOPIC_FROM_PATIENT_MESSAGE_VARIABLES, PATIENT_MESSAGE_SUMMARY_VARIABLES, PRIORITY_FROM_PATIENT_MESSAGE_VARIABLES, PromptVariable, TASK_CODE_FROM_PATIENT_MESSAGE_VARIABLES, TASK_DESCRIPTION_FROM_PATIENT_MESSAGE_VARIABLES } from './prompt-variables';

export interface ClaudeConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class ClaudeClient {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly maxTokens: number;
  private readonly temperature: number;

  constructor(config: ClaudeConfig) {
    if (!config.apiKey) {
      throw new Error("apiKey is required");
    }
    this.apiKey = config.apiKey;
    console.log("this.apiKey", this.apiKey);
    this.model = config.model ?? "claude-3-5-haiku-20241022";
    this.maxTokens = config.maxTokens ?? 4096;
    this.temperature = config.temperature ?? 1;
  }

private makeRequest(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsedData);
            } else {
              reject(new Error(`API request failed: ${responseData}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.write(JSON.stringify(data));
      req.end();
    });
  }

  getPatientMessageSummary(message: string): Promise<any> {
    const prompt = `
      Please shorten these patient messages into point form. Be sure to include all clinically relevant info.
      Below are three examples:
      {{message1}}
      {{summary1}}
      -----
      {{message2}}
      {{summary2}}
      -----
      {{message3}}
      {{summary3}}
    `;

    const promptVariables = PATIENT_MESSAGE_SUMMARY_VARIABLES;

    return this.getUserMessageFromPrompt(prompt, promptVariables, message);
  }

  getPriorityFromPatientMessage(message: string): Promise<any> {
    const prompt = `
        Please determine the priority of the patient message.
        The priority can take on the following values: 'routine', 'urgent', 'asap', 'stat'.
        Routine messages are requests with normal priority.
        Urgent messages are requests that should be actioned promptly - higher priority than routine.
        ASAP messages are requests that should be actioned as soon as possible - higher priority than urgent.
        Stat messages are requests that should be actioned immediately - highest possible priority. E.g. an emergency.
        Below are three examples:
        {{message1}}
        {{priority1}}
        -----
        {{message2}}
        {{priority2}}
        -----
        {{message3}}
        {{priority3}}
      `;

    return this.getUserMessageFromPrompt(prompt, PRIORITY_FROM_PATIENT_MESSAGE_VARIABLES, message);
  }

  getCommunicationTopicFromPatientMessage(message: string): Promise<any> {
    const prompt = `
      Please determine the topic of the patient message.
      The topic can take on the following values: 'prescription-refill-request', 'progress-update', 'report-labs', 'appointment-reminder', 'phone-consult', 'summary-report'.
      Prescription refill requests are requests for a prescription to be refilled.
      Progress updates are requests for updates on the patient's progress.
      Report labs requests are requests for the patient to report their labs.
      Appointment reminders are requests for a reminder about an upcoming appointment.
      Phone consults are requests for a phone consult.
      Summary reports are requests for a summary report.
      Only output the topic.
      Below are three examples:
      {{message1}}
      {{topic1}}
      -----
      {{message2}}
      {{topic2}}
      -----
      {{message3}}
      {{topic3}}
    `;

    return this.getUserMessageFromPrompt(prompt, COMMUNICATION_TOPIC_FROM_PATIENT_MESSAGE_VARIABLES, message);

  }

  getTaskDescriptionFromPatientMessage(message: string): Promise<any> {
    const prompt = `
      Please generate a task description for the patient message.
      The task description should be a short, human-readable description of what is to be performed.
      Only output the description.
      Below are three examples:
      {{message1}}
      {{taskDescription1}}
      -----
      {{message2}}
      {{taskDescription2}}
      -----
      {{message3}}
      {{taskDescription3}}
    `;

    return this.getUserMessageFromPrompt(prompt, TASK_DESCRIPTION_FROM_PATIENT_MESSAGE_VARIABLES, message);
  }

  getTaskCodeFromPatientMessage(message: string): Promise<any> {
    const prompt = `
      Please generate a task code for the patient message.
      The task code can take on the following values: 'approve', 'fulfill', 'abort', 'replace', 'change', 'suspend', 'resume'.
      Approve indicates to take what actions are needed to transition the focus resource from 'draft' to 'active' or 'in-progress', as appropriate for the resource type. This may involve adding additional content, approval, validation, etc.
      Fulfill indicates to act to perform the actions defined in the focus request. This might result in a 'more assertive' request (order for a plan or proposal, filler order for a placer order), but is intended to eventually result in events. The degree of fulfillment requestsed might be limited by Task.restriction.
      Abort indicates to abort, cancel or withdraw the focal resource, as appropriate for the type of resource.
      Replace indicates to replace the focal resource with the specified input resource.
      Change indicates to update the focal resource of the owning system to reflect the contenct specifies as the Task.focus.
      Suspend indicates to transition the focus resource from 'active' or 'in-progress' to 'suspended'.
      Resume indicates to transition the focal resource from 'suspended'.
      Only output the task code.
      Below are three examples:
      {{message1}}
      {{taskCode1}}
      -----
      {{message2}}
      {{taskCode2}}
      -----
      {{message3}}
      {{taskCode3}}
    `;

    return this.getUserMessageFromPrompt(prompt, TASK_CODE_FROM_PATIENT_MESSAGE_VARIABLES, message);
  }

  getUserMessageFromPrompt(prompt: string, promptVariables: PromptVariable[], message: string) {
    const promptWithVariables = promptVariables.reduce((acc, variable) => {
      return acc.replace(variable.replacementToken, variable.value);
    }, prompt);

    return this.makeRequest({
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      system: promptWithVariables,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: message }
          ]
        }
      ]
    });
  }
}
