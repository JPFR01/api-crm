import { HttpMethod } from "@/v1/domain/repository/HttpMethod";
import { BookingRepository, BookingData } from "@/v1/domain/entities/booking/BookingRepository";
import { TokenCRMInterface } from "@/v1/domain/repository/token/Token";
import { AxiosRequestConfig } from "axios";

export class ClinicaExpertsBookingRepository implements BookingRepository {
  constructor(
    private readonly http: HttpMethod,
    private readonly tokenProvider: TokenCRMInterface,
  ) {}

  async create(providerUrl: string, bookingData: BookingData): Promise<any> {
      const token = await this.tokenProvider.getToken();

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

      const response = await this.http.post(
        `${providerUrl}/api/v1/bookings`,
        bookingData,
        config,
        "ClinicaExpertsBookingRepository.create",
      );

      return response.data;
  }
}
