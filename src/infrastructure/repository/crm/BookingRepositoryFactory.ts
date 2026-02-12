import { HttpMethodFactory } from "@/main/factories/repository/http-methods/HttpMethodFactory";
import { BookingRepository } from "@/v1/domain/entities/booking/BookingRepository";
import { ClinicaExpertsBookingRepository } from "./clinica_experts/ClinicaExpertsBookingRepository";
import { TokenCrmFactory } from "@/main/factories/repository/token/TokenCrmFactory";
import { InvalidParamError } from "@/v1/domain/shared/errors";
import { CrmContext } from "@/types/express";

export const BookingRepositoryFactory = (
  context: CrmContext,
): BookingRepository => {
  const http = HttpMethodFactory();

  const token = TokenCrmFactory({
    providerId: context.providerId,
    providerName: context.providerName,
    companyId: context.companyId,
    providerUrl: context.providerUrl,
  });

  const providers: Record<string, () => BookingRepository> = {
    clinica_experts: () => new ClinicaExpertsBookingRepository(http, token),
  };
  const factory = providers[context.providerName];

  if (!factory) {
    throw new InvalidParamError(
      `CRM provider não suportado: ${context.providerName}`,
    );
  }

  return factory();
};
