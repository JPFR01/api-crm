import { HttpMethodFactory } from "@/main/factories/repository/http-methods/HttpMethodFactory";
import { PatientRepository } from "@/v1/domain/entities/patient/PatientRepository";
import { ClinicaExpertsPatientRepository } from "./clinica_experts/ClinicaExpertsPatientRepository";
import { TokenCrmFactory } from "@/main/factories/repository/token/TokenCrmFactory";

export type CrmProvider = "clinica_experts" | "hubspot";

export type CrmContext = {
  provider: CrmProvider;
  companyId: string;
};

export const PatientRepositoryFactory = (
  context: CrmContext,
): PatientRepository => {
  const http = HttpMethodFactory();

  const token = TokenCrmFactory({
    provider: context.provider,
    companyId: context.companyId,
  });

  const providers = {
    clinica_experts: () => new ClinicaExpertsPatientRepository(http, token), // o provider vem do BANCO, deve ter exatamente o nome clinica_experts para ser encontrado

    //hubspot: () => new HubspotPatientRepository(http, token),
  };

  const factory = providers[context.provider];

  if (!factory) {
    throw new Error(`CRM provider não suportado: ${context.provider}`);
  }

  return factory(); // aqui retorna o clinica_experts, a api usa ele para chamar o /list dele, so preciso consertar o token para arrumar a chamada
};
