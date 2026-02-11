import { Controller } from "@/v1/presentation/helpers/Controller";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { ok } from "@/v1/presentation/helpers/http-helper";
import { CrmContext } from "@/types/express";
import { InvalidParamError } from "@/v1/domain/shared/errors";
import { CreatePatient } from "@/v1/domain/entities/crm/patients/create-patient/CreatePatient";

export class CreatePatientController implements Controller {
  constructor(
    private readonly createPatientFactory: (ctx: CrmContext) => CreatePatient,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const crmContext = httpRequest?.crmContext;
    if (!crmContext) {
      throw new InvalidParamError(
        "Controller.CreatePatientController",
        "crmContext não encontrado",
      );
    }
      const createPatient = this.createPatientFactory(crmContext);

      const response = await createPatient.execute({
        data: httpRequest.body,
        providerUrl: crmContext.providerUrl || "",
      });

      return ok(response);
  }
}
