import {
  ListProfessionals as _ListProfessionals,
  ListProfessionalsRequest,
  ListProfessionalsResponse,
} from "@/v1/domain/entities/crm/professionals/list-professionals/ListProfessionals";
import { ProfessionalRepository } from "@/v1/domain/entities/professional/ProfessionalRepository";

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>; // key = field name, value = list of messages
}

export class ListProfessionals implements _ListProfessionals {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}

  async execute(
    request: ListProfessionalsRequest,
  ): Promise<ListProfessionalsResponse> {
    // regras de negócio aqui (se houver)
    console.log(request);
    const data = await this.professionalRepository.list(
      request.providerUrl,
      request.filters,
    );

    return { data };
  }
}
