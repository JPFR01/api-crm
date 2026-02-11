import { ProfessionalRepositoryFactory } from "@/infrastructure/repository/crm/ProfessionalRepositoryFactory";
import { CrmContext } from "@/types/express";
import { ListProfessionals } from "@/v1/application/entities/crm/professionals/list-professionals/ListProfessionals";
import { ListProfessionals as _ListProfessionals } from "@/v1/domain/entities/crm/professionals/list-professionals/ListProfessionals";

export const ListProfessionalsFactory = (
  crmContext: CrmContext,
): _ListProfessionals => {
  return new ListProfessionals(ProfessionalRepositoryFactory(crmContext));
};
// token da minha api deve conter os dados de CRMContext para gerar o token da clinica.
