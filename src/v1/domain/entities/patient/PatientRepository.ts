import { Patient } from "../crm/patients/list-patients/ListPatients";

export type PatientFilters = {
  name?: string;
  cpf?: string;
  phone?: string;
  active?: boolean;
};

export interface PatientRepository {
  list(filters?: PatientFilters): Promise<Patient[]>;
}
