import { WhatsAppWebhook } from "@/v1/application/entities/whatsapp/whatsapp-webhook/WhatsAppWebhook";
import { CreatePatientFactory } from "../../patient/create-patient/CreatePatientFactory";

export const WhatsAppWebhookFactory = () => {
  const createPatient = CreatePatientFactory();
  return new WhatsAppWebhook(createPatient);
};
