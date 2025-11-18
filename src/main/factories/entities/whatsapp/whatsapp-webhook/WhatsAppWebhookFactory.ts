import { WhatsAppWebhook } from "@/v1/application/entities/whatsapp/whatsapp-webhook/WhatsAppWebhook";
import { ConversationStateRepository } from "@/v1/domain/repository/conversation/ConversationState";
import { WhatsAppMessaging } from "@/v1/domain/repository/whatsapp/WhatsAppMessaging";

export const WhatsAppWebhookFactory = (
  conversationRepo: ConversationStateRepository,
  whatsappMessaging: WhatsAppMessaging,
  createPatient: any
) => {
  return new WhatsAppWebhook(
    conversationRepo,
    whatsappMessaging,
    createPatient
  );
};
