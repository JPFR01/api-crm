import { Controller } from "@/v1/presentation/helpers/Controller";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { ok } from "@/v1/presentation/helpers/http-helper";
import { CrmContext } from "@/types/express";
import { InvalidParamError } from "@/v1/domain/shared/errors";
import { ListAvailableHours } from "@/v1/domain/entities/crm/bookings/list-available-hours/ListAvailableHours";

export class ListAvailableHoursController implements Controller {
  constructor(
    private readonly listAvailableHoursFactory: (ctx: CrmContext) => ListAvailableHours,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const crmContext = httpRequest?.crmContext;
    if (!crmContext) {
      throw new InvalidParamError(
        "Controller.ListAvailableHoursController",
        "crmContext não encontrado",
      );
    }

    const { professional_uuid, starts_at, interval } = httpRequest.query;

    if (!professional_uuid) {
         throw new InvalidParamError("professional_uuid", "Profissional não informado");
    }
    if (!starts_at) {
        throw new InvalidParamError("starts_at", "Data inicial não informada");
    }
    if (!interval) {
        throw new InvalidParamError("interval", "Intervalo não informado");
    }

    const listAvailableHours = this.listAvailableHoursFactory(crmContext);

    const response = await listAvailableHours.execute({
      providerUrl: crmContext.providerUrl || "",
      professionalId: String(professional_uuid),
      startsAt: String(starts_at),
      interval: Number(interval),
    });

    return ok(response.data);
  }
}
