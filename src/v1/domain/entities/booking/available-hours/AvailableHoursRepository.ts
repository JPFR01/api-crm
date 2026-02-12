export interface ListAvailableHoursParams {
  professionalId: string;
  startsAt: string; // YYYY-MM-DD
  interval: number;
}

export interface AvailableHoursRepository {
  list(
    providerUrl: string,
    params: ListAvailableHoursParams,
  ): Promise<{ date: string; data: string[] }[]>;
}
