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
      const token = await this.tokenProvider.getToken(); // aqui, realmente precisa dar get no token se eu já faço isso lá atras? pensar nisso

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
        `${providerUrl}/api/v1/professionals`, // PEGAR URL DO BANCO PARA MELHOR ESCALABILIDADE
        config,
        "ClinicaExpertsProfessionalRepository.list",
      );

      return response.data; // DEFINIR INTERFACES DE RESPOSTA PARA MELHOR ESCALABILIDADE
    } catch (err: any) {
      throw new Error("Erro inesperado ao listar pacientes");
    }
  }
}
