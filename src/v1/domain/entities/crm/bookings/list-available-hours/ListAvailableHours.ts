export interface ListAvailableHoursRequest {
  professionalId: string;
  startsAt: string; // YYYY-MM-DD
  interval: number;
  providerUrl: string;
}

export interface ListAvailableHoursResponse {
  data: { date: string; data: string[] }[];
}

export interface ListAvailableHours {
  execute(
    request: ListAvailableHoursRequest,
  ): Promise<ListAvailableHoursResponse>;
}
