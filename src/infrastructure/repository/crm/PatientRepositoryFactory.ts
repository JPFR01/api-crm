import { HttpMethodFactory } from "@/main/factories/repository/http-methods/HttpMethodFactory";
import { PatientRepository } from "@/v1/domain/entities/patient/PatientRepository";
import { ClinicaExpertsPatientRepository } from "./clinica_experts/ClinicaExpertsPatientRepository";
import { TokenCrmFactory } from "@/main/factories/repository/token/TokenCrmFactory";
import { InvalidParamError } from "@/v1/domain/shared/errors";
import { CrmContext } from "@/types/express";

export type CrmProvider = "clinica_experts" | "hubspot";

export const PatientRepositoryFactory = (
  context: CrmContext,
): PatientRepository => {
  const http = HttpMethodFactory();

  const token = TokenCrmFactory({
    providerName: context.providerName,
    providerId: context.providerId,
    companyId: context.companyId,
  });

  const providers = {
    clinica_experts: () => new ClinicaExpertsPatientRepository(http, token), // o provider vem do BANCO, deve ter exatamente o nome clinica_experts para ser encontrado

    //hubspot: () => new HubspotPatientRepository(http, token),
  };

  const factory = providers[context.providerName];

  if (!factory) {
    throw new InvalidParamError(
      `CRM provider não suportado: ${context.providerName}`,
    );
  }

  return factory(); // aqui retorna o clinica_experts, a api usa ele para chamar o /list dele, so preciso consertar o token para arrumar a chamada
};
