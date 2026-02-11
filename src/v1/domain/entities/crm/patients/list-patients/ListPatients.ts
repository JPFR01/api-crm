export interface ListPatientsRequest {
  filters?: {
    name?: string;
    email?: string;
    phone?: string;
    active?: boolean;
  };
  providerUrl: string;
}

export interface Patient {
  uuid: string;
  name: string;
  email: string;
  phone: string;
}

export interface ListPatientsResponse {
  data: Patient[];
}

export interface ListPatients {
  execute(request: ListPatientsRequest): Promise<ListPatientsResponse>;
}
