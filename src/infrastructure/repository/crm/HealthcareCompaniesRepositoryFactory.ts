/* eslint-disable camelcase */
import { HttpMethodFactory } from "@/main/factories/repository/http-methods/HttpMethodFactory";
import { TokenCrmFactory } from "@/main/factories/repository/token/TokenCrmFactory";
import { InvalidParamError } from "@/v1/domain/shared/errors";
import { CrmContext } from "@/types/express";
import { HealthcareCompaniesRepository } from "@/v1/domain/entities/crm/healthcare-companies/HealthcareCompaniesRepository";
import { ClinicaExpertsHealthcareCompaniesRepository } from "./clinica_experts/ClinicaExpertsHealthcareCompaniesRepository";

export const HealthcareCompaniesRepositoryFactory = (
  context: CrmContext,
): HealthcareCompaniesRepository => {
  const http = HttpMethodFactory();

  const token = TokenCrmFactory({
    providerId: context.providerId,
    providerName: context.providerName,
    companyId: context.companyId,
    providerUrl: context.providerUrl,
  });

  const providers: Record<string, () => HealthcareCompaniesRepository> = {
    clinica_experts: () =>
      new ClinicaExpertsHealthcareCompaniesRepository(http, token),
  };
  const factory = providers[context.providerName];

  if (!factory) {
    throw new InvalidParamError(
      `CRM provider não suportado: ${context.providerName}`,
    );
  }

  return factory();
};
