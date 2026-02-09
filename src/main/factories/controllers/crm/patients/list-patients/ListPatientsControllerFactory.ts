import { ListPatientsFactory } from "@/main/factories/entities/crm/patients/list-patients/ListPatientsFactory";
import { ListPatientsController } from "@/v1/presentation/controllers/crm/patients/list-patients/ListPatientsController";
import { Controller } from "@/v1/presentation/helpers/Controller";

export const ListPatientsControllerFactory = (): Controller => {
  return new ListPatientsController(ListPatientsFactory);
};
