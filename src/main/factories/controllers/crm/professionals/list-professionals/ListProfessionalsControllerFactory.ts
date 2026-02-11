import { ListProfessionalsFactory } from "@/main/factories/entities/crm/professionals/list-professionals/ListProfessionalsFactory";
import { ListProfessionalsController } from "@/v1/presentation/controllers/crm/professionals/list-professionals/ListProfessionalsController";
import { Controller } from "@/v1/presentation/helpers/Controller";

export const ListProfessionalsControllerFactory = (): Controller => {
  return new ListProfessionalsController(ListProfessionalsFactory);
};
