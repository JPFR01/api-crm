import { WhatsAppWebhookFactory } from "../../../entities/whatsapp/whatsapp-webhook/WhatsAppWebhookFactory";
import { WhatsAppWebhookController } from "@/v1/presentation/controllers/whatsapp/whatsapp-webhook/WhatsappWebhookController";
import { ConversationStateRepository } from "@/v1/domain/repository/conversation/ConversationState";
import { WhatsAppMessaging } from "@/v1/domain/repository/whatsapp/WhatsAppMessaging";

export const WhatsAppWebhookControllerFactory = (
  conversationRepo: ConversationStateRepository,
  whatsappMessaging: WhatsAppMessaging,
  createPatient: any,
  logger: any
) => {
  const whatsappWebhook = WhatsAppWebhookFactory(
    conversationRepo,
    whatsappMessaging,
    createPatient
  );

  return new WhatsAppWebhookController(whatsappWebhook, logger);
};
