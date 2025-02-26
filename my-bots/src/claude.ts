import Anthropic from "@anthropic-ai/sdk";

export interface ClaudeConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class ClaudeClient {
  private client: Anthropic;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor(config: ClaudeConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
    this.model = config.model ?? "claude-3-5-haiku-20241022";
    this.maxTokens = config.maxTokens ?? 8192;
    this.temperature = config.temperature ?? 1;
  }

  async summarizePatientMessage(message: string): Promise<any> {
    return this.client.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      system: "Please shorten these patient messages into point form. Be sure to include all clinically relevant info.\nBelow are three examples:\n{{message1}}\n{{summary1}}\n-----\n{{message2}}\n{{summary2}}\n-----\n{{message3}}\n{{summary3}}",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message,
            }
          ]
        }
      ]
    });
  }
}