import { Request, Response } from "express";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { Controller } from "@/v1/presentation/helpers/Controller";
import { httpResponseHelper } from "@/v1/presentation/helpers/httpResponseHelper";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      ip: req.ip,
      body: req.body,
      headers: req.headers,
      socket: req.socket,
      params: req.params,
      query: req.query,
      crmContext: req.crmContext,
    };
    try {
      const httpResponse: HttpResponse = await controller.handle(httpRequest);

      if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
        return res.status(httpResponse.statusCode).json(httpResponse.body.data);
      }
      return res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
      const httpResponse: HttpResponse = httpResponseHelper(
        error,
        "",
        "Express",
        "CatchExpressAdaptRoute",
        "ExpressAdaptRoute",
      );

      // envia de fato a resposta HTTP
      return res.status(httpResponse.statusCode).json(httpResponse.body);
    }
  };
};
