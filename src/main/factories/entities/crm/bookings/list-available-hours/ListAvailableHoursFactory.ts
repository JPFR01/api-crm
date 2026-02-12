import { AvailableHoursRepositoryFactory } from "@/infrastructure/repository/crm/AvailableHoursRepositoryFactory";
import { CrmContext } from "@/types/express";
import { ListAvailableHours } from "@/v1/application/entities/crm/bookings/list-available-hours/ListAvailableHours";
import { ListAvailableHours as _ListAvailableHours } from "@/v1/domain/entities/crm/bookings/list-available-hours/ListAvailableHours";

export const ListAvailableHoursFactory = (
  crmContext: CrmContext,
): _ListAvailableHours => {
  return new ListAvailableHours(AvailableHoursRepositoryFactory(crmContext));
};
