import { Controller } from "@/v1/presentation/helpers/Controller";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import axios from "axios";

export class ForwardMetaWebhookController implements Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const webhookUrl = process.env.N8N_META_WEBHOOK_URL;
      
      if (!webhookUrl) {
        console.error("N8N_META_WEBHOOK_URL is not defined in the environment.");
        return { statusCode: 500, body: "Webhook URL Configuration Error" };
      }

      // Forward to n8n asynchronously without blocking the Meta response.
      // Meta expects a 200 OK fast or it will retry.
      axios.post(webhookUrl, request.body, {
        headers: {
          // Forwarding signature in case n8n needs it
          'x-hub-signature-256': request.headers['x-hub-signature-256']
        }
      }).catch(err => {
         console.error("Failed to forward webhook to n8n:", err.message);
      });

      return {
        statusCode: 200,
        body: "EVENT_RECEIVED", // Standard response expected by Meta
      };
    } catch (error) {
      console.error("Error in ForwardMetaWebhookController:", error);
      return {
        statusCode: 500,
        body: error instanceof Error ? error.message : "Internal Server Error",
      };
    }
  }
}
