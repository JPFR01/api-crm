import { Controller } from "@/v1/presentation/helpers/Controller";
import { ForwardMetaWebhookController } from "@/v1/presentation/controllers/meta/forward-webhook/ForwardMetaWebhookController";

export const ForwardMetaWebhookControllerFactory = (): Controller => {
  return new ForwardMetaWebhookController();
};
