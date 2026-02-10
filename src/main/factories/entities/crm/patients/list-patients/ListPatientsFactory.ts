import { PatientRepositoryFactory } from "@/infrastructure/repository/crm/PatientRepositoryFactory";
import { CrmContext } from "@/types/express";
import { ListPatients } from "@/v1/application/entities/crm/patients/list-patients/ListPatients";
import { ListPatients as _ListPatients } from "@/v1/domain/entities/crm/patients/list-patients/ListPatients";

export const ListPatientsFactory = (crmContext: CrmContext): _ListPatients => {
  return new ListPatients(PatientRepositoryFactory(crmContext));
};
// token da minha api deve conter os dados de CRMContext para gerar o token da clinica.
