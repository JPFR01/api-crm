import { ValidationHelper } from "@/infrastructure/helpers/ValidationHelper";
import {
  ConversationState,
  RegistrationStep,
} from "@/v1/domain/entities/patient/conversation-state/ConversationState";
import {
  CreatePatient,
  CreatePatientRequest,
} from "@/v1/domain/entities/patient/create-patient/CreatePatient";
import { ConversationStateRepository } from "@/v1/domain/repository/conversation/ConversationState";
import {
  WhatsAppMessage,
  WhatsAppMessaging,
} from "@/v1/domain/repository/whatsapp/WhatsAppMessaging";

export interface PatientData {
  name?: string;
  phone?: string;
  cpf?: string; // Stored as string during conversation
  date_birth?: string; // Stored as DD/MM/YYYY string
  email?: string;
}
export class WhatsAppWebhook {
  constructor(
    private readonly conversationRepo: ConversationStateRepository,
    private readonly whatsappMessaging: WhatsAppMessaging,
    private readonly createPatient: CreatePatient // Your CreatePatient service
  ) {}

  async execute(webhookPayload: any): Promise<any> {
    // Extract message from WhatsApp webhook payload
    const message = this.extractMessage(webhookPayload);

    if (!message || message.type !== "text") {
      return {
        status: "ignored",
        reason: "Non-text message or invalid payload",
      };
    }

    const userId = message.from;
    const userMessage = message.text?.body?.trim() || "";

    // Handle commands
    if (
      userMessage.toLowerCase() === "/start" ||
      userMessage.toLowerCase() === "iniciar"
    ) {
      await this.conversationRepo.delete(userId);
      await this.startRegistration(userId);
      return { status: "registration_started", userId };
    }

    if (
      userMessage.toLowerCase() === "/cancelar" ||
      userMessage.toLowerCase() === "cancelar"
    ) {
      await this.conversationRepo.delete(userId);
      await this.whatsappMessaging.sendText(
        userId,
        "❌ Cadastro cancelado.\n\nDigite /start para recomeçar quando quiser."
      );
      return { status: "registration_cancelled", userId };
    }

    // Get or create conversation state
    let state = await this.conversationRepo.get(userId);

    if (!state) {
      await this.startRegistration(userId);
      return { status: "registration_started", userId };
    }

    // Process message based on current step
    const result = await this.processStep(state, userMessage);

    return result;
  }

  private async startRegistration(userId: string): Promise<void> {
    const state: ConversationState = {
      userId,
      step: RegistrationStep.INITIAL,
      data: {},
      lastMessageAt: new Date(),
      retryCount: 0,
    };

    await this.conversationRepo.save(state);

    await this.whatsappMessaging.sendText(
      userId,
      "👋 Olá! Bem-vindo(a) à Clínica Experts!\n\n" +
        "Vou ajudá-lo(a) a realizar seu cadastro.\n\n" +
        "📝 *Por favor, informe seu nome completo:*\n\n" +
        "_(Digite /cancelar a qualquer momento para sair)_"
    );

    state.step = RegistrationStep.AWAITING_NAME;
    await this.conversationRepo.save(state);
  }

  private async processStep(
    state: ConversationState,
    message: string
  ): Promise<any> {
    switch (state.step) {
      case RegistrationStep.AWAITING_NAME:
        return await this.handleNameInput(state, message);

      case RegistrationStep.AWAITING_PHONE:
        return await this.handlePhoneInput(state, message);

      case RegistrationStep.AWAITING_CPF:
        return await this.handleCPFInput(state, message);

      case RegistrationStep.AWAITING_DATE_BIRTH:
        return await this.handleDateBirthInput(state, message);

      case RegistrationStep.AWAITING_EMAIL:
        return await this.handleEmailInput(state, message);

      case RegistrationStep.AWAITING_CONFIRMATION:
        return await this.handleConfirmation(state, message);

      default:
        return { status: "unknown_step", step: state.step };
    }
  }

  private async handleNameInput(
    state: ConversationState,
    message: string
  ): Promise<any> {
    const validation = ValidationHelper.validateName(message);

    if (!validation.valid) {
      await this.whatsappMessaging.sendText(
        state.userId,
        `❌ ${validation.error}\n\nTente novamente:`
      );
      return {
        status: "validation_error",
        field: "name",
        error: validation.error,
      };
    }

    state.data.name = message.trim();
    state.step = RegistrationStep.AWAITING_PHONE;
    await this.conversationRepo.save(state);

    await this.whatsappMessaging.sendText(
      state.userId,
      `Prazer, ${state.data.name.split(" ")[0]}! 😊\n\n` +
        "📱 *Agora, informe seu telefone com DDD:*\n\n" +
        "Exemplo: (11) 98765-4321 ou 11987654321"
    );

    return { status: "step_completed", step: "name", nextStep: "phone" };
  }

  private async handlePhoneInput(
    state: ConversationState,
    message: string
  ): Promise<any> {
    const validation = ValidationHelper.validatePhone(message);

    if (!validation.valid) {
      await this.whatsappMessaging.sendText(
        state.userId,
        `❌ ${validation.error}\n\nTente novamente:`
      );
      return {
        status: "validation_error",
        field: "phone",
        error: validation.error,
      };
    }

    state.data.phone = validation.normalized!;
    state.step = RegistrationStep.AWAITING_CPF;
    await this.conversationRepo.save(state);

    await this.whatsappMessaging.sendText(
      state.userId,
      "Perfeito! ✅\n\n" +
        "🆔 *Informe seu CPF (apenas números):*\n\n" +
        "Exemplo: 12345678900"
    );

    return { status: "step_completed", step: "phone", nextStep: "cpf" };
  }

  private async handleCPFInput(
    state: ConversationState,
    message: string
  ): Promise<any> {
    const validation = ValidationHelper.validateCPF(message);

    if (!validation.valid) {
      await this.whatsappMessaging.sendText(
        state.userId,
        `❌ ${validation.error}\n\nTente novamente:`
      );
      return {
        status: "validation_error",
        field: "cpf",
        error: validation.error,
      };
    }

    state.data.cpf = validation.normalized!;
    state.step = RegistrationStep.AWAITING_DATE_BIRTH;
    await this.conversationRepo.save(state);

    await this.whatsappMessaging.sendText(
      state.userId,
      "Ótimo! 📋\n\n" +
        "🎂 *Informe sua data de nascimento:*\n\n" +
        "Use o formato: DD/MM/AAAA\n" +
        "Exemplo: 15/03/1990"
    );

    return { status: "step_completed", step: "cpf", nextStep: "date_birth" };
  }

  private async handleDateBirthInput(
    state: ConversationState,
    message: string
  ): Promise<any> {
    const validation = ValidationHelper.validateDateBirth(message);

    if (!validation.valid) {
      await this.whatsappMessaging.sendText(
        state.userId,
        `❌ ${validation.error}\n\nTente novamente:`
      );
      return {
        status: "validation_error",
        field: "date_birth",
        error: validation.error,
      };
    }

    state.data.date_birth = validation.normalized!;
    state.step = RegistrationStep.AWAITING_EMAIL;
    await this.conversationRepo.save(state);

    await this.whatsappMessaging.sendText(
      state.userId,
      "Excelente! 🎉\n\n" +
        "📧 *Por último, informe seu email:*\n\n" +
        "_(Digite 'pular' se não quiser informar)_"
    );

    return { status: "step_completed", step: "date_birth", nextStep: "email" };
  }

  private async handleEmailInput(
    state: ConversationState,
    message: string
  ): Promise<any> {
    const validation = ValidationHelper.validateEmail(message);

    if (!validation.valid) {
      await this.whatsappMessaging.sendText(
        state.userId,
        `❌ ${validation.error}\n\nTente novamente:`
      );
      return {
        status: "validation_error",
        field: "email",
        error: validation.error,
      };
    }

    if (message.toLowerCase() !== "pular" && message.toLowerCase() !== "skip") {
      state.data.email = message.trim();
    }

    state.step = RegistrationStep.AWAITING_CONFIRMATION;
    await this.conversationRepo.save(state);

    const summary = this.buildSummary(state.data);
    await this.whatsappMessaging.sendText(
      state.userId,
      "📋 *Confirme seus dados:*\n\n" +
        summary +
        "\n\n" +
        "✅ Digite *CONFIRMAR* para finalizar\n" +
        "✏️ Digite *CORRIGIR* para refazer o cadastro"
    );

    return {
      status: "step_completed",
      step: "email",
      nextStep: "confirmation",
    };
  }

  private async handleConfirmation(
    state: ConversationState,
    message: string
  ): Promise<any> {
    const normalized = message.toUpperCase().trim();

    if (
      normalized === "CONFIRMAR" ||
      normalized === "SIM" ||
      normalized === "OK"
    ) {
      try {
        // Call your existing CreatePatient service
        if (!state.data.name || !state.data.phone) {
          throw new Error("Dados incompletos para cadastro");
        }

        // Transform conversation data to CreatePatientRequest format
        const patientRequest = this.mapToCreatePatientRequest(state.data);

        await this.createPatient.create(patientRequest);

        await this.whatsappMessaging.sendText(
          state.userId,
          "✅ *Cadastro realizado com sucesso!*\n\n" +
            "Seu cadastro foi registrado em nosso sistema.\n\n" +
            "Em breve nossa equipe entrará em contato para agendar sua consulta. 📅\n\n" +
            "Obrigado por escolher a Clínica Experts! 💙"
        );

        state.step = RegistrationStep.COMPLETED;
        await this.conversationRepo.delete(state.userId);

        return {
          status: "registration_completed",
          patient: state.data,
          userId: state.userId,
        };
      } catch (error: any) {
        await this.whatsappMessaging.sendText(
          state.userId,
          "❌ *Erro ao realizar cadastro.*\n\n" +
            (error.message || "Ocorreu um erro inesperado.") +
            "\n\n" +
            "Por favor, tente novamente mais tarde ou entre em contato pelo telefone."
        );

        throw error; // Re-throw to be caught by controller
      }
    } else if (
      normalized === "CORRIGIR" ||
      normalized === "NAO" ||
      normalized === "NÃO"
    ) {
      await this.conversationRepo.delete(state.userId);
      await this.startRegistration(state.userId);

      return { status: "registration_restarted", userId: state.userId };
    } else {
      await this.whatsappMessaging.sendText(
        state.userId,
        "⚠️ Resposta não reconhecida.\n\nPor favor, digite *CONFIRMAR* ou *CORRIGIR*"
      );

      return { status: "invalid_confirmation", message };
    }
  }
  private mapToCreatePatientRequest(
    data: Partial<PatientData>
  ): CreatePatientRequest {
    // Parse date from DD/MM/YYYY to Date object
    const parseDateBirth = (dateStr?: string): Date | undefined => {
      if (!dateStr) return undefined;
      const [day, month, year] = dateStr.split("/");
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    // Build the request matching your CreatePatientRequest interface
    const request: CreatePatientRequest = {
      name: data.name || "",
      phone: data.phone,
      email: data.email,
      date_birth: parseDateBirth(data.date_birth),
      documents: data.cpf
        ? [
            {
              type: "cpf",
              value: data.cpf,
            },
          ]
        : undefined,
      origin: "WhatsApp Bot",
      origin_referrer: "whatsapp_registration_flow",
      active: true,
      tags: ["whatsapp-registration"],
      header: {
        authorization: `Bearer ${process.env.API_CRM}`,
        // Add any other required header fields here
      },
    };

    return request;
  }

  private buildSummary(data: Partial<PatientData>): string {
    // ✅ Fixed: Use PatientData
    return `👤 Nome: ${data.name}
📱 Telefone: ${data.phone}
🆔 CPF: ${data.cpf}
🎂 Data Nasc.: ${data.date_birth}${data.email ? `\n📧 Email: ${data.email}` : ""}`;
  }

  private extractMessage(payload: any): WhatsAppMessage | null {
    try {
      const entry = payload?.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      return messages?.[0] || null;
    } catch {
      return null;
    }
  }

  // Webhook verification method (for GET requests)
  verifyWebhook(
    mode: string,
    token: string,
    challenge: string,
    verifyToken: string
  ): string | null {
    if (mode === "subscribe" && token === verifyToken) {
      return challenge;
    }
    return null;
  }
}
