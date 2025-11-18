import { PatientData } from "@/v1/application/entities/whatsapp/whatsapp-webhook/WhatsAppWebhook";

// Domain: ConversationState.ts
export enum RegistrationStep {
  INITIAL = "initial",
  AWAITING_NAME = "awaiting_name",
  AWAITING_PHONE = "awaiting_phone",
  AWAITING_CPF = "awaiting_cpf",
  AWAITING_DATE_BIRTH = "awaiting_date_birth",
  AWAITING_EMAIL = "awaiting_email",
  AWAITING_CONFIRMATION = "awaiting_confirmation",
  COMPLETED = "completed",
}

export interface ConversationState {
  userId: string; // WhatsApp phone number
  step: RegistrationStep;
  data: Partial<PatientData>;
  lastMessageAt: Date;
  retryCount: number;
}
