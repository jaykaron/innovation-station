import https from 'https';

export interface ClaudeConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class ClaudeClient {
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;

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

private async makeRequest(data: any): Promise<any> {
    console.log("this.apiKey in req", this.apiKey);
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

  async summarizePatientMessage(message: string): Promise<any> {
    const data = {
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      system: "Please shorten these patient messages into point form. Be sure to include all clinically relevant info.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message
            }
          ]
        }
      ]
    };
    console.log("data", data);
    return this.makeRequest(data);
  }
}