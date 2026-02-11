export interface CreatePatientRequest {
  data: {
    name: string;
    date_birth: string;
    email: string;
    phone: string;
  };
  providerUrl: string;
}

export interface Patient {
  uuid: string;
  name: string;
  email: string;
  phone: string;
}

export interface CreatePatientsResponse {
  data: Patient;
}

export interface CreatePatient {
  execute(request: CreatePatientRequest): Promise<CreatePatientsResponse>;
}
