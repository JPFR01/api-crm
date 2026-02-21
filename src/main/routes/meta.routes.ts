import { Router } from "express";
import { adaptRoute } from "@/main/adapter/express/expressRouteAdapter";
import { metaSignatureMiddleware } from "@/main/MetaSignatureMiddleware";
import { VerifyMetaWebhookControllerFactory } from "@/main/factories/controllers/meta/verify-webhook/VerifyMetaWebhookControllerFactory";
import { ForwardMetaWebhookControllerFactory } from "@/main/factories/controllers/meta/forward-webhook/ForwardMetaWebhookControllerFactory";

export default (router: Router): void => {
  // Configuração e validação do Webhook pelo Meta
  router.get(
    "/v1/webhook/whatsapp-meta",
    adaptRoute(VerifyMetaWebhookControllerFactory())
  );

  // Recebimento de mensagens e eventos encaminhados do Meta para N8N
  router.post(
    "/v1/webhook/whatsapp-meta",
    metaSignatureMiddleware,
    adaptRoute(ForwardMetaWebhookControllerFactory())
  );
};
