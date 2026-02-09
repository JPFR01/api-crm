import {
  ListPatients as _ListPatients,
  ListPatientsRequest,
  ListPatientsResponse,
} from "@/v1/domain/entities/crm/patients/list-patients/ListPatients";
import { PatientRepository } from "@/v1/domain/entities/patient/PatientRepository";

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>; // key = field name, value = list of messages
}

export class ListPatients implements _ListPatients {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(request: ListPatientsRequest): Promise<ListPatientsResponse> {
    // regras de negócio aqui (se houver)
    const patients = await this.patientRepository.list(request);

    return { patients };
  }
}
