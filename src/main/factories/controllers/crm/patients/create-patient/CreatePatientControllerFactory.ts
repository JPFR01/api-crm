import { CreatePatientFactory } from "@/main/factories/entities/crm/patients/create-patient/CreatePatientFactory";
import { CreatePatientController } from "@/v1/presentation/controllers/crm/patients/create-patient/CreatePatientController";
import { Controller } from "@/v1/presentation/helpers/Controller";

export const CreatePatientControllerFactory = (): Controller => {
  return new CreatePatientController(CreatePatientFactory);
};
