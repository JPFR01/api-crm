import { Controller } from "@/v1/presentation/helpers/Controller";
import { HttpRequest, HttpResponse } from "@/v1/presentation/protocols/Http";
import { ok } from "@/v1/presentation/helpers/http-helper";
import { CrmContext } from "@/types/express";
import { InvalidParamError } from "@/v1/domain/shared/errors";
import { CreateBooking } from "@/v1/domain/entities/crm/bookings/create-booking/CreateBooking";

export class CreateBookingController implements Controller {
  constructor(
    private readonly createBookingFactory: (ctx: CrmContext) => CreateBooking,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const crmContext = httpRequest?.crmContext;
    if (!crmContext) {
      throw new InvalidParamError(
        "Controller.CreateBookingController",
        "crmContext não encontrado",
      );
    }
      const createBooking = this.createBookingFactory(crmContext);

      const response = await createBooking.execute({
        data: httpRequest.body,
        providerUrl: crmContext.providerUrl || "",
      });

      return ok(response);
  }
}
