import {
  CreatePatient,
  CreatePatientRequest,
} from "@/v1/domain/entities/patient/create-patient/CreatePatient";
import { InvalidParamError } from "@/v1/domain/shared/errors";

export interface WhatsAppWebhookData {
  entry: {
    changes: {
      value: {
        messages?: {
          from: string;
          text?: { body: string };
          type: string;
        }[];
        contacts?: {
          profile?: { name: string };
          wa_id?: string;
        }[];
      };
    }[];
  }[];
}

/**
 * Application layer use case:
 * Transforms WhatsApp webhook messages into a Patient creation request.
 */
export class WhatsAppWebhook {
  constructor(private readonly createPatient: CreatePatient) {}

  async execute(webhookData: WhatsAppWebhookData): Promise<any> {
    const entry = webhookData?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (!value?.messages?.length) {
      throw new InvalidParamError(
        "WhatsAppWebhook",
        "No messages found in webhook payload."
      );
    }

    const message = value.messages[0];
    const contact = value.contacts?.[0];

    const name = contact?.profile?.name ?? "Paciente WhatsApp";
    const phone = contact?.wa_id ?? message.from;
    const textBody = message.text?.body ?? "";

    const createPatientData: CreatePatientRequest = {
      name,
      phone,
      annotation: textBody,
      date_birth: new Date(), // placeholder
      sex: "M", // or null until collected interactively
      marital_status: null,
      header: {
        authorization: process.env.API_CRM,
      },
    };

    // Validate and create
    await this.createPatient.validate(createPatientData);
    const patient = await this.createPatient.create(createPatientData);

    return { success: true, patient };
  }
}
