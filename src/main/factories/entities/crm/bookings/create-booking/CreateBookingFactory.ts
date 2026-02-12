import { BookingRepositoryFactory } from "@/infrastructure/repository/crm/BookingRepositoryFactory";
import { CrmContext } from "@/types/express";
import { CreateBooking } from "@/v1/application/entities/crm/bookings/create-booking/CreateBooking";
import { CreateBooking as _CreateBooking } from "@/v1/domain/entities/crm/bookings/create-booking/CreateBooking";

export const CreateBookingFactory = (
  crmContext: CrmContext,
): _CreateBooking => {
  return new CreateBooking(BookingRepositoryFactory(crmContext));
};
