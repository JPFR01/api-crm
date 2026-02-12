import { ListAvailableHoursFactory } from "@/main/factories/entities/crm/bookings/list-available-hours/ListAvailableHoursFactory";
import { ListAvailableHoursController } from "@/v1/presentation/controllers/crm/bookings/list-available-hours/ListAvailableHoursController";
import { Controller } from "@/v1/presentation/helpers/Controller";

export const ListAvailableHoursControllerFactory = (): Controller => {
  return new ListAvailableHoursController(ListAvailableHoursFactory);
};
