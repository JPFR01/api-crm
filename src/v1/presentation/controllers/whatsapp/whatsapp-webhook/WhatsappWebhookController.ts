import { Controller } from "@/v1/presentation/helpers/Controller";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { ok } from "@/v1/presentation/helpers/http-helper";
import { httpResponseHelper } from "@/v1/presentation/helpers/httpResponseHelper";
import { Logger } from "@/v1/domain/repository/Logger";
import { HttpStatusCode } from "axios";
import { WhatsAppWebhook } from "@/v1/application/entities/whatsapp/whatsapp-webhook/WhatsAppWebhook";

export class WhatsAppWebhookController implements Controller {
  constructor(
    private readonly whatsAppWebhook: WhatsAppWebhook,
    private readonly logger: Logger
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const webhookData = httpRequest.body;

    try {
      await this.logger.info({
        origem: "v1/whatsapp/webhook",
        versao: "v1",
        destino: "WhatsAppWebhook",
        classe: "WhatsAppWebhookController",
        body: webhookData,
      });

      const patient = await this.whatsAppWebhook.execute(webhookData);

      await this.logger.info({
        origem: "Response - v1/whatsapp/webhook",
        versao: "v1",
        destino: "WhatsAppWebhook",
        classe: "WhatsAppWebhookController",
        response: patient,
        status: HttpStatusCode.Ok,
      });

      return ok({
        status: "success",
        message: "Webhook processed and patient created successfully",
        patient,
      });
    } catch (error) {
      return httpResponseHelper(
        error,
        webhookData,
        "v1/whatsapp/webhook",
        "WhatsAppWebhook",
        "WhatsAppWebhookController"
      );
    }
  }
}
