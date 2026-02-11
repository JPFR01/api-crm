import { HttpMethod } from "@/v1/domain/repository/HttpMethod";
import { TokenCRMInterface } from "@/v1/domain/repository/token/Token";
import { Patient } from "@/v1/domain/entities/crm/patients/list-patients/ListPatients";
import { AxiosRequestConfig } from "axios";
import { ProfessionalRepository } from "@/v1/domain/entities/professional/ProfessionalRepository";

export class ClinicaExpertsProfessionalRepository
  implements ProfessionalRepository
{
  constructor(
    private readonly http: HttpMethod,
    private readonly tokenProvider: TokenCRMInterface,
  ) {}

  async list(
    providerUrl: string,
    filters?: {
      name?: string;
      uuid?: string;
      phone?: string;
      active?: boolean;
    },
  ): Promise<Patient[]> {
    try {
      const token = await this.tokenProvider.getToken();

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: {
          phone: filters?.phone,
          name: filters?.name,
          uuid: filters?.uuid,
          active: filters?.active,
        },
      };

      const response = await this.http.get(
        `${providerUrl}/api/v1/professionals`,
        config,
        "ClinicaExpertsProfessionalRepository.list",
      );

      // ⚡ Filtra apenas profissionais com CRM
      const professionalsWithCrm = response.data.filter(
        (person: any) =>
          person.board?.code?.toLowerCase() === "crm" && !!person.board?.number,
      );

      return professionalsWithCrm;
    } catch (err: any) {
      throw new Error("Erro inesperado ao listar profissionais");
    }
  }
}
