import { HttpMethod } from "@/v1/domain/repository/HttpMethod";
import { PatientRepository } from "../../../../v1/domain/entities/patient/PatientRepository";
import { TokenCRM } from "@/v1/domain/repository/token/Token";
import { Patient } from "@/v1/domain/entities/crm/patients/list-patients/ListPatients";

export class ClinicaExpertsPatientRepository implements PatientRepository {
  constructor(
    private readonly http: HttpMethod,
    private readonly tokenProvider: TokenCRM,
  ) {}

  async list(filters?: {
    name?: string;
    cpf?: string;
    phone?: string;
    active?: boolean;
  }): Promise<Patient[]> {
    const token = await this.tokenProvider.getToken(); // aqui, realmente precisa dar get no token se eu já faço isso lá atras? pensar nisso

    const response = await this.http.get<any[]>({
      method: "GET",
      url: "/patients",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: this.mapFilters(filters),
    });

    return response.data.map(this.mapPatient);
  }

  private mapFilters(filters?: any) {
    if (!filters) return undefined;

    return {
      nome: filters.name,
      cpf: filters.cpf,
      telefone: filters.phone,
      ativo: filters.active,
    };
  }

  private mapPatient(raw: any): Patient {
    return {
      id: raw.id,
      name: raw.nome,
      cpf: raw.cpf,
      phone: raw.telefone,
      active: raw.ativo ?? true,
      createdAt: new Date(raw.created_at ?? Date.now()),
    };
  }
}
