import { PatientRepositoryFactory } from "@/infrastructure/repository/crm/PatientRepositoryFactory";
import { CrmContext } from "@/types/express";
import { CreatePatient } from "@/v1/application/entities/crm/patients/create-patient/CreatePatient";
import { CreatePatient as _CreatePatient } from "@/v1/domain/entities/crm/patients/create-patient/CreatePatient";

export const CreatePatientFactory = (
  crmContext: CrmContext,
): _CreatePatient => {
  return new CreatePatient(PatientRepositoryFactory(crmContext));
};
