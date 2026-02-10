import { Patient } from "../crm/patients/list-patients/ListPatients";

export type PatientFilters = {
  name?: string;
  cpf?: string;
  phone?: string;
  active?: boolean;
};

export interface PatientRepository {
  list(providerUrl: string, filters?: PatientFilters): Promise<Patient[]>;
}
