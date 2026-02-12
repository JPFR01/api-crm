import { CreateBookingFactory } from "@/main/factories/entities/crm/bookings/create-booking/CreateBookingFactory";
import { CreateBookingController } from "@/v1/presentation/controllers/crm/bookings/create-booking/CreateBookingController";
import { Controller } from "@/v1/presentation/helpers/Controller";

export const CreateBookingControllerFactory = (): Controller => {
  return new CreateBookingController(CreateBookingFactory);
};
