import { Router } from "express";
import { adaptRoute } from "@/main/adapter/express/expressRouteAdapter";
import { WhatsAppWebhookControllerFactory } from "../factories/controllers/whatsapp/whatsapp-webhook/WhatsAppWebhookControllerFactory";
import { CreatePatientFactory } from "../factories/entities/patient/create-patient/CreatePatientFactory";
import { LoggerFactory } from "@/main/factories/repository/logger/LoggerFactory";
import { InMemoryConversationStateRepository } from "@/infrastructure/repository/conversation/inMemoryConversationState";
import { WhatsAppBusinessMessaging } from "@/infrastructure/repository/whatsapp/WhatsAppBusinessMessaging";
import { HttpMethodFactory } from "../factories/repository/http-methods/HttpMethodFactory";

export default (router: Router): void => {
  // Initialize dependencies
  const conversationRepo = new InMemoryConversationStateRepository();

  const httpClient = HttpMethodFactory(); // Your HTTP client
  const whatsappMessaging = new WhatsAppBusinessMessaging(
    httpClient,
    process.env.WHATSAPP_PHONE_NUMBER_ID!,
    process.env.WHATSAPP_TOKEN!
  );

  const createPatient = CreatePatientFactory();
  const logger = LoggerFactory();

  // Create controller
  const controller = WhatsAppWebhookControllerFactory(
    conversationRepo,
    whatsappMessaging,
    createPatient,
    logger
  );

  // Register routes - both GET and POST
  router.get("/v1/whatsapp/webhook", adaptRoute(controller));
  router.post("/v1/whatsapp/webhook", adaptRoute(controller));
};
