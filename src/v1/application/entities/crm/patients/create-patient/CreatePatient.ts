import {
  CreatePatient as _CreatePatient,
  CreatePatientRequest,
  CreatePatientsResponse,
} from "@/v1/domain/entities/crm/patients/create-patient/CreatePatient";
import { PatientRepository } from "@/v1/domain/entities/patient/PatientRepository";

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>; // key = field name, value = create of messages
}

export class CreatePatient implements _CreatePatient {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(
    request: CreatePatientRequest,
  ): Promise<CreatePatientsResponse> {
    // regras de negócio aqui (se houver)
    console.log(request);
    const data = await this.patientRepository.create(
      request.providerUrl,
      request.data,
    );

    return;
  }
}
