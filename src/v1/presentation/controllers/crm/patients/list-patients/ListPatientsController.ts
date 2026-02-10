import { Controller } from "@/v1/presentation/helpers/Controller";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { ok } from "@/v1/presentation/helpers/http-helper";
import { ListPatients } from "@/v1/domain/entities/crm/patients/list-patients/ListPatients";
import { CrmContext } from "@/types/express";
import { InvalidParamError } from "@/v1/domain/shared/errors";

export class ListPatientsController implements Controller {
  constructor(
    private readonly listPatientsFactory: (ctx: CrmContext) => ListPatients,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const crmContext = httpRequest?.crmContext;
    if (!crmContext) {
      throw new InvalidParamError(
        "Controller.ListPatientsController",
        "crmContext não encontrado",
      );
    }
    try {
      const listPatients = this.listPatientsFactory(crmContext);

      const response = await listPatients.execute({
        filters: httpRequest.query,
        name: "",
        header: undefined,
        providerUrl: crmContext.providerUrl || "",
      });

      return ok(response);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
