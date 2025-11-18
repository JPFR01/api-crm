import { WhatsAppMessaging } from "@/v1/domain/repository/whatsapp/WhatsAppMessaging";

export class WhatsAppBusinessMessaging implements WhatsAppMessaging {
  private readonly baseUrl: string;
  private readonly phoneNumberId: string;
  private readonly token: string;

  constructor(
    private readonly httpClient: any, // Your HTTP client
    phoneNumberId: string,
    token: string
  ) {
    this.baseUrl = `https://graph.facebook.com/v18.0`;
    this.phoneNumberId = phoneNumberId;
    this.token = token;
  }

  async sendText(to: string, message: string): Promise<void> {
    try {
      await this.httpClient.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: {
            preview_url: false,
            body: message,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      throw error;
    }
  }

  async sendTemplate(
    to: string,
    templateName: string,
    params: string[]
  ): Promise<void> {
    await this.httpClient.post(
      `${this.baseUrl}/${this.phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "pt_BR" },
          components: [
            {
              type: "body",
              parameters: params.map((p) => ({ type: "text", text: p })),
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }
}
