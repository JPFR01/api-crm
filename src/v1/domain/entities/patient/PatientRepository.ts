import { Patient } from "../crm/patients/list-patients/ListPatients";

export type PatientFilters = {
  name?: string;
  cpf?: string;
  phone?: string;
  active?: boolean;
};

export type PatientData = {
  name: string;
  date_birth: string;
  email: string;
  phone: string;
};

export interface PatientRepository {
  create(providerUrl: any, patientData: PatientData): Promise<void>;
  list(providerUrl: string, filters?: PatientFilters): Promise<Patient[]>;
}
