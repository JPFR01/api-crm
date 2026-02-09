import { Controller } from "@/v1/presentation/helpers/Controller";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { ok } from "@/v1/presentation/helpers/http-helper";
import { ListPatients } from "@/v1/domain/entities/crm/patients/list-patients/ListPatients";
import { CrmContext } from "@/infrastructure/repository/crm/PatientRepositoryFactory";

export class ListPatientsController implements Controller {
  constructor(
    private readonly listPatientsFactory: (ctx: CrmContext) => ListPatients,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const crmContext = httpRequest.crmContext;

    const listPatients = this.listPatientsFactory(crmContext);

    const response = await listPatients.execute({
      filters: httpRequest.query,
      name: "",
      tags: [],
      header: undefined,
    });

    return ok(response);
  }
}
