import { HttpMethodFactory } from "@/main/factories/repository/http-methods/HttpMethodFactory";
import { ClinicaExpertsProfessionalRepository } from "./clinica_experts/ClinicaExpertsProfessionalRepository";
import { TokenCrmFactory } from "@/main/factories/repository/token/TokenCrmFactory";
import { InvalidParamError } from "@/v1/domain/shared/errors";
import { CrmContext } from "@/types/express";
import { ProfessionalRepository } from "@/v1/domain/entities/professional/ProfessionalRepository";

export const ProfessionalRepositoryFactory = (
  context: CrmContext,
): ProfessionalRepository => {
  const http = HttpMethodFactory();

  const token = TokenCrmFactory({
    providerId: context.providerId,
    providerName: context.providerName,
    companyId: context.companyId,
    providerUrl: context.providerUrl,
  });

  const providers: Record<string, () => ProfessionalRepository> = {
    clinica_experts: () =>
      new ClinicaExpertsProfessionalRepository(http, token),
    //hubspot: () => new HubspotProfessionalRepository(http, token),
  };
  const factory = providers[context.providerName];

  if (!factory) {
    throw new InvalidParamError(
      `CRM provider não suportado: ${context.providerName}`,
    );
  }

  return factory(); // aqui retorna o clinica_experts, a api usa ele para chamar o /list dele, so preciso consertar o token para arrumar a chamada
};
