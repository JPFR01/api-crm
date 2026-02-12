import {
  CreateBooking as _CreateBooking,
  CreateBookingRequest,
  CreateBookingResponse,
} from "@/v1/domain/entities/crm/bookings/create-booking/CreateBooking";
import { BookingRepository } from "@/v1/domain/entities/booking/BookingRepository";

export class CreateBooking implements _CreateBooking {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(
    request: CreateBookingRequest,
  ): Promise<CreateBookingResponse> {
    
    //console.log(request);
    const data = await this.bookingRepository.create(
      request.providerUrl,
      request.data,
    );

    return data;
  }
}
