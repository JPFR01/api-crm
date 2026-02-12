import { AvailableHoursRepository } from "@/v1/domain/entities/booking/available-hours/AvailableHoursRepository";
import {
  ListAvailableHours as _ListAvailableHours,
  ListAvailableHoursRequest,
  ListAvailableHoursResponse,
} from "@/v1/domain/entities/crm/bookings/list-available-hours/ListAvailableHours";

export class ListAvailableHours implements _ListAvailableHours {
  constructor(private readonly availableHoursRepository: AvailableHoursRepository) {}

  async execute(
    request: ListAvailableHoursRequest,
  ): Promise<ListAvailableHoursResponse> {
    const data = await this.availableHoursRepository.list(
      request.providerUrl,
      {
        professionalId: request.professionalId,
        startsAt: request.startsAt,
        interval: request.interval,
      },
    );

    return { data };
  }
}
