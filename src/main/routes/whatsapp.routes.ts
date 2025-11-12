import { Router } from 'express';
import { adaptRoute } from '@/main/adapter/express/expressRouteAdapter';
import { WhatsAppWebhookControllerFactory } from '../factories/controllers/whatsapp/whatsapp-webhook/WhatsAppWebhookControllerFactory';

export default (router: Router): void => {
  router.post('/v1/whatsapp/webhook', adaptRoute(WhatsAppWebhookControllerFactory()));
};
