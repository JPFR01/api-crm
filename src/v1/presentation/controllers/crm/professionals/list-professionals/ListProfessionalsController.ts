import { Controller } from "@/v1/presentation/helpers/Controller";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { ok } from "@/v1/presentation/helpers/http-helper";
import { ListProfessionals } from "@/v1/domain/entities/crm/professionals/list-professionals/ListProfessionals";
import { CrmContext } from "@/types/express";
import { InvalidParamError } from "@/v1/domain/shared/errors";

export class ListProfessionalsController implements Controller {
  constructor(
    private readonly listProfessionalsFactory: (ctx: CrmContext) => ListProfessionals,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const crmContext = httpRequest?.crmContext;
    if (!crmContext) {
      throw new InvalidParamError(
        "Controller.ListProfessionalsController",
        "crmContext não encontrado",
      );
    }
    try {
      const listProfessionals = this.listProfessionalsFactory(crmContext);

      const response = await listProfessionals.execute({
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
