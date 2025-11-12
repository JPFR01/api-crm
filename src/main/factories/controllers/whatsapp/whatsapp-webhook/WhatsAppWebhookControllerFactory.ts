import { LoggerFactory } from "@/main/factories/repository/logger/LoggerFactory";
import { WhatsAppWebhookFactory } from "../../../entities/whatsapp/whatsapp-webhook/WhatsAppWebhookFactory";
import { WhatsAppWebhookController } from "@/v1/presentation/controllers/whatsapp/whatsapp-webhook/WhatsappWebhookController";

export const WhatsAppWebhookControllerFactory = () => {
  return new WhatsAppWebhookController(WhatsAppWebhookFactory(), LoggerFactory());
};
