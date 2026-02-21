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
        if (httpResponse.body?.data !== undefined) {
          return res.status(httpResponse.statusCode).json(httpResponse.body.data);
        }
        
        // If body is just a primitive (e.g., string like "12345" for Meta Challenge), use .send() instead of .json()
        if (typeof httpResponse.body === 'string' || typeof httpResponse.body === 'number') {
           return res.status(httpResponse.statusCode).send(httpResponse.body);
        }

        return res.status(httpResponse.statusCode).json(httpResponse.body);
      }
      return res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
      console.log({error});
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
