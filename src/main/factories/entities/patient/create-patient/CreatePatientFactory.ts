import { CrmFactory } from "@/main/factories/repository/crm/CrmFactory";
import { HttpMethodFactory } from "@/main/factories/repository/http-methods/HttpMethodFactory";
import { CreatePatient } from "@/v1/application/entities/patient/create-patient/CreatePatient";
import { CreatePatient as _CreatePatient } from "@/v1/domain/entities/patient/create-patient/CreatePatient";

export const CreatePatientFactory = (): _CreatePatient => {
  return new CreatePatient(CrmFactory(), HttpMethodFactory());
};
