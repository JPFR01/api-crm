import { httpResponseHelper } from "@/v1/presentation/helpers/httpResponseHelper";
import { Controller } from "@/v1/presentation/helpers/Controller";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { ok } from "@/v1/presentation/helpers/http-helper";
import { Logger } from "@/v1/domain/repository/Logger";
import {
  CreatePatient,
  CreatePatientData,
} from "@/v1/domain/entities/patient/create-patient/CreatePatient";
import { HttpStatusCode } from "axios";

export class CreatePatientController implements Controller {
  constructor(
    private readonly createPatient: CreatePatient,
    private readonly logger: Logger
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const createPatientRequest: CreatePatientData = {
      body: httpRequest.body,
      header: httpRequest.headers,
    };

    try {
      await this.logger.info({
        origem: "v1/usuarios/recuperarDadosPessoais",
        versao: "v1",
        destino: "recuperarDadosPessoais",
        classe: "CreatePatientController",
        headerLog: { "device-id": createPatientRequest.header["device-id"] },
        body: createPatientRequest,
      });

      await this.createPatient.validate(createPatientRequest);
      const createPatientResponse: void =
        await this.createPatient.create(createPatientRequest);

      await this.logger.info({
        origem: "Response - v1/usuarios/recuperarDadosPessoais",
        versao: "v1",
        destino: "recuperarDadosPessoais",
        classe: "CreatePatientController",
        body: createPatientRequest,
        response: createPatientResponse,
        status: HttpStatusCode.Ok,
      });

      return ok(createPatientResponse);
    } catch (error) {
      return httpResponseHelper(
        error,
        createPatientRequest,
        "v1/usuarios/recuperarDadosPessoais",
        "recuperarDadosPessoais",
        "CreatePatientController"
      );
    }
  }
}
