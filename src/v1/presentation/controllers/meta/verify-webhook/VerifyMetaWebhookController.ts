import { Controller } from "@/v1/presentation/helpers/Controller";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { badRequest, forbidden } from "@/v1/presentation/helpers/http-helper";
import { Error as CustomError } from "@/v1/domain/shared/errors/Error";

export class VerifyMetaWebhookController implements Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const mode = request.query["hub.mode"];
      const token = request.query["hub.verify_token"];
      const challenge = request.query["hub.challenge"];

      if (mode && token) {
        if (mode === "subscribe" && token === process.env.HUB_VERIFY_TOKEN_META) {
          return {
            statusCode: 200,
            body: challenge,
          };
        }
        return forbidden(new CustomError(new Error("Token de verificação inválido")));
      }

      return badRequest(new CustomError(new Error("Parâmetros ausentes")));
    } catch (error) {
      return {
        statusCode: 500,
        body: error instanceof Error ? error.message : "Internal Server Error",
      };
    }
  }
}
