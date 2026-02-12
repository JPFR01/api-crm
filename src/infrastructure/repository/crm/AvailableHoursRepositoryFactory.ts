import { HttpMethodFactory } from "@/main/factories/repository/http-methods/HttpMethodFactory";
import { AvailableHoursRepository } from "@/v1/domain/entities/booking/available-hours/AvailableHoursRepository";
import { ClinicaExpertsAvailableHoursRepository } from "./clinica_experts/ClinicaExpertsAvailableHoursRepository";
import { TokenCrmFactory } from "@/main/factories/repository/token/TokenCrmFactory";
import { InvalidParamError } from "@/v1/domain/shared/errors";
import { CrmContext } from "@/types/express";

export const AvailableHoursRepositoryFactory = (
  context: CrmContext,
): AvailableHoursRepository => {
  const http = HttpMethodFactory();

  const token = TokenCrmFactory({
    providerId: context.providerId,
    providerName: context.providerName,
    companyId: context.companyId,
    providerUrl: context.providerUrl,
  });

  const providers: Record<string, () => AvailableHoursRepository> = {
    clinica_experts: () => new ClinicaExpertsAvailableHoursRepository(http, token),
  };
  const factory = providers[context.providerName];

  if (!factory) {
    throw new InvalidParamError(
      `CRM provider não suportado: ${context.providerName}`,
    );
  }

  return factory();
};
