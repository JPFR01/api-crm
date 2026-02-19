import { HttpMethod } from "@/v1/domain/repository/HttpMethod";
import { HealthcareCompaniesRepository } from "@/v1/domain/entities/crm/healthcare-companies/HealthcareCompaniesRepository";
import { HealthcareCompany } from "@/v1/domain/entities/crm/healthcare-companies/list-healthcare-companies/ListHealthcareCompanies";
import { TokenCRMInterface } from "@/v1/domain/repository/token/Token";
import { AxiosRequestConfig } from "axios";

interface ClinicaExpertsHealthcareCompany {
  uuid: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ClinicaExpertsResponse {
  data: ClinicaExpertsHealthcareCompany[];
  meta: any;
}

export class ClinicaExpertsHealthcareCompaniesRepository
  implements HealthcareCompaniesRepository
{
  constructor(
    private readonly http: HttpMethod,
    private readonly tokenProvider: TokenCRMInterface,
  ) {}

  async list(providerUrl: string): Promise<HealthcareCompany[]> {
    try {
      const token = await this.tokenProvider.getToken();

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

      const response = (await this.http.get(
        `${providerUrl}/api/v1/healthcare-companies`,
        config,
        "ClinicaExpertsHealthcareCompaniesRepository.list",
      )) as unknown as ClinicaExpertsResponse;

      return response.data.map((item: ClinicaExpertsHealthcareCompany) => ({
        uuid: item.uuid,
        description: item.description,
        active: item.active,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    } catch (err: any) {
      console.error(
        "Error in ClinicaExpertsHealthcareCompaniesRepository.list:",
        err,
      );
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      }
      throw new Error(
        `Erro inesperado ao listar convenios: ${err.message}`,
      );
    }
  }
}
