import {
  CreatePatient,
  CreatePatientRequest,
  SexEnum,
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
      /* sex: SexEnum.M, */ // or null until collected interactively
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

// exemplo de payload:
/* active
: 
true
age
: 
0
annotation
: 
null
contacts
: 
[]
created_at
: 
"2025-11-12 20:11:15"
custom_fields_values
: 
[]
date_birth
: 
"2025-11-06"
entity_id
: 
7123752
entity_type
: 
"patient"
first_name
: 
"teste"
id
: 
7123752
is_lead
: 
false
is_patient
: 
true
is_professional
: 
false
is_provider
: 
false
marital_status
: 
"Solteiro"
name
: 
"teste joao"
notification_channel_email
: 
true
notification_channel_sms
: 
true
notification_channel_whatsapp
: 
false
notifications
: 
[{type: "SMS", value: true}, {type: "EMAIL", value: true}, {type: "WHATSAPP", value: false}]
occupation
: 
null
origin
: 
null
person_has_late_title_parcel
: 
false
person_id
: 
7123752
phone
: 
{id: 5384086, type: "mobile", phone_type: "mobile", category: "billing", number: "+5518999999999",…}
referral_person_id
: 
null
sex
: 
"M" */
