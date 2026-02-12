import { HttpMethod } from "@/v1/domain/repository/HttpMethod";
import { AvailableHoursRepository, ListAvailableHoursParams } from "@/v1/domain/entities/booking/available-hours/AvailableHoursRepository";
import { TokenCRMInterface } from "@/v1/domain/repository/token/Token";
import { AxiosRequestConfig } from "axios";

export class ClinicaExpertsAvailableHoursRepository implements AvailableHoursRepository {
  constructor(
    private readonly http: HttpMethod,
    private readonly tokenProvider: TokenCRMInterface,
  ) {}

  async list(
    providerUrl: string,
    params: ListAvailableHoursParams,
  ): Promise<{ date: string; data: string[] }[]> {
    const token = await this.tokenProvider.getToken();
    const result: { date: string; data: string[] }[] = [];
    let totalHoursCount = 0;
    const MAX_HOURS = 9;

    const startDate = new Date(params.startsAt);

    // Sequential execution to stop after limit is reached
    for (let i = 0; i < 7; i++) {
      if (totalHoursCount >= MAX_HOURS) {
        break;
      }

      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      const hours = await this.fetchHoursForDate(
        providerUrl,
        token,
        params.professionalId,
        params.interval,
        dateStr
      );

      result.push({ date: dateStr, data: hours });
      
      if (hours.length > 0) {
        totalHoursCount += hours.length;
      }
    }

    return result;
  }

  private async fetchHoursForDate(
    providerUrl: string,
    token: string,
    professionalUuid: string,
    interval: number,
    date: string,
  ): Promise<string[]> {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      params: {
        date,
        professional_uuid: professionalUuid,
        interval,
      },
    };

    try {
      const response = await this.http.get(
        `${providerUrl}/api/v1/available-hours`,
        config,
        "ClinicaExpertsAvailableHoursRepository.list",
      );
     
      // External API returns { "data": ["14:00", ...] }
      if (response && response.data && Array.isArray(response.data)) {
           return response.data;
      }
      
      return [];

    } catch (error) {
      // If one day fails, we might want to return empty for that day or throw.
      // Returning empty array for robustness unless critical.
      console.error(`Error fetching hours for ${date}:`, error);
      return [];
    }
  }
}
