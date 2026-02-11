import { HttpMethod } from "@/v1/domain/repository/HttpMethod";
import {
  PatientData,
  PatientRepository,
} from "../../../../v1/domain/entities/patient/PatientRepository";
import { TokenCRMInterface } from "@/v1/domain/repository/token/Token";
import { Patient } from "@/v1/domain/entities/crm/patients/list-patients/ListPatients";
import { AxiosRequestConfig } from "axios";




export function toCurl(
  method: string,
  url: string,
  config?: AxiosRequestConfig,
) {
  const parts = [`curl -X ${method.toUpperCase()}`];

  // headers
  if (config?.headers) {
    Object.entries(config.headers).forEach(([key, value]) => {
      parts.push(`-H '${key}: ${value}'`);
    });
  }

  // query params
  if (config?.params) {
    const query = new URLSearchParams(config.params).toString();
    url += `?${query}`;
  }

  // body
  if (config?.data) {
    const data =
      typeof config.data === "string"
        ? config.data
        : JSON.stringify(config.data);
    parts.push(`-d '${data}'`);
  }

  parts.push(`'${url}'`);

  return parts.join(" \\\n  ");
}

export class ClinicaExpertsPatientRepository implements PatientRepository {
  constructor(
    private readonly http: HttpMethod,
    private readonly tokenProvider: TokenCRMInterface,
  ) {}

  async create(providerUrl: any, patientData: PatientData): Promise<void> {
      const token = await this.tokenProvider.getToken(); // aqui, realmente precisa dar get no token se eu já faço isso lá atras? pensar nisso

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

      /* console.log(toCurl("GET", "$/v1/patients", config)); */

    const response = await this.http.post(
        `${providerUrl}/api/v1/patients`, // PEGAR URL DO BANCO PARA MELHOR ESCALABILIDADE
        patientData,
        config,
        "ClinicaExpertsPatientRepository.create",
      );

      return response.data; // DEFINIR INTERFACES DE RESPOSTA PARA MELHOR ESCALABILIDADE
  }

  async list(
    providerUrl: string,
    filters?: {
      name?: string;
      cpf?: string;
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
        },
      };

      /* console.log(toCurl("GET", "$/v1/patients", config)); */

      const response = await this.http.get(
        `${providerUrl}/api/v1/patients`, // PEGAR URL DO BANCO PARA MELHOR ESCALABILIDADE
        config,
        "ClinicaExpertsPatientRepository.list",
      );

      return response.data; // DEFINIR INTERFACES DE RESPOSTA PARA MELHOR ESCALABILIDADE
    } catch (err: any) {
      throw new Error("Erro inesperado ao listar pacientes");
    }
  }
}
