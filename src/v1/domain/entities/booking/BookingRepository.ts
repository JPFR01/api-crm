export interface BookingData {
  starts_at: string;
  ends_at: string;
  status: string;
  check_availability: boolean;
  professional: string; // UUID
  patient: string; // UUID
}

export interface BookingRepository {
  create(providerUrl: string, data: BookingData): Promise<any>;
}
