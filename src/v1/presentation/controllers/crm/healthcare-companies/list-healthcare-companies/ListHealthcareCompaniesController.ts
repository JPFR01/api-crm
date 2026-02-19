import { Controller } from "@/v1/presentation/helpers/Controller";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { ok } from "@/v1/presentation/helpers/http-helper";
import { CrmContext } from "@/types/express";
import { InvalidParamError } from "@/v1/domain/shared/errors";
import { ListHealthcareCompanies } from "@/v1/domain/entities/crm/healthcare-companies/list-healthcare-companies/ListHealthcareCompanies";

export class ListHealthcareCompaniesController implements Controller {
  constructor(
    private readonly listHealthcareCompaniesFactory: (
      ctx: CrmContext,
    ) => ListHealthcareCompanies,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const crmContext = httpRequest?.crmContext;
    if (!crmContext) {
      throw new InvalidParamError(
        "Controller.ListHealthcareCompaniesController",
        "crmContext não encontrado",
      );
    }
    try {
      const listHealthcareCompanies =
        this.listHealthcareCompaniesFactory(crmContext);

      const response = await listHealthcareCompanies.execute({
        providerUrl: crmContext.providerUrl || "",
      });

      return ok(response);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
