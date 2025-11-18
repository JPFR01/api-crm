import { WhatsAppWebhook } from "@/v1/application/entities/whatsapp/whatsapp-webhook/WhatsAppWebhook";
import { Controller } from "@/v1/presentation/helpers/Controller";
import { httpResponseHelper } from "@/v1/presentation/helpers/httpResponseHelper";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { Logger } from "winston";

export class WhatsAppWebhookController implements Controller {
  constructor(
    private readonly whatsAppWebhook: WhatsAppWebhook,
    private readonly logger: Logger
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    // Detect if it's a GET request for verification
    const method = (httpRequest as any).method;

    if (method === "GET") {
      return this.handleVerification(httpRequest);
    }

    // Handle POST request for incoming messages
    const webhookData = httpRequest.body;

    try {
      await this.logger.info({
        origem: "v1/whatsapp/webhook",
        versao: "v1",
        destino: "WhatsAppWebhook",
        classe: "WhatsAppWebhookController",
        body: webhookData,
      });

      const result = await this.whatsAppWebhook.execute(webhookData);

      await this.logger.info({
        origem: "Response - v1/whatsapp/webhook",
        versao: "v1",
        destino: "WhatsAppWebhook",
        classe: "WhatsAppWebhookController",
        response: result,
        status: 200,
      });

      return {
        statusCode: 200,
        body: {
          status: "success",
          message: "Webhook processed successfully",
          data: result,
        },
      };
    } catch (error) {
      await this.logger.error({
        origem: "Error - v1/whatsapp/webhook",
        versao: "v1",
        destino: "WhatsAppWebhook",
        classe: "WhatsAppWebhookController",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      return httpResponseHelper(
        error,
        webhookData,
        "v1/whatsapp/webhook",
        "WhatsAppWebhook",
        "WhatsAppWebhookController"
      );
    }
  }

  private handleVerification(httpRequest: HttpRequest): HttpResponse {
    try {
      const query = httpRequest.query || {};
      const mode = query["hub.mode"];
      const token = query["hub.verify_token"];
      const challenge = query["hub.challenge"];

      const verifyToken =
        process.env.WHATSAPP_VERIFY_TOKEN || "your_verify_token";

      const result = this.whatsAppWebhook.verifyWebhook(
        mode,
        token,
        challenge,
        verifyToken
      );

      if (result) {
        // Return challenge as plain string (WhatsApp requirement)
        return {
          statusCode: 200,
          body: result, // This will be sent as plain text
        };
      } else {
        return {
          statusCode: 403,
          body: { error: "Forbidden - Invalid verification token" },
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: "Internal server error during verification" },
      };
    }
  }
}
