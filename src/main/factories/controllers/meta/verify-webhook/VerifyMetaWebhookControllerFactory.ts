import { Controller } from "@/v1/presentation/helpers/Controller";
import { VerifyMetaWebhookController } from "@/v1/presentation/controllers/meta/verify-webhook/VerifyMetaWebhookController";

export const VerifyMetaWebhookControllerFactory = (): Controller => {
  return new VerifyMetaWebhookController();
};
