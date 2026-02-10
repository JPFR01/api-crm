import { HttpMethod } from "@/v1/domain/repository/HttpMethod";
import { PatientRepository } from "../../../../v1/domain/entities/patient/PatientRepository";
import { TokenCRM } from "@/v1/domain/repository/token/Token";
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
    private readonly tokenProvider: TokenCRM,
  ) {}

  async list(filters?: {
    name?: string;
    cpf?: string;
    phone?: string;
    active?: boolean;
  }): Promise<Patient[]> {
    const token = await this.tokenProvider.getToken(); // aqui, realmente precisa dar get no token se eu já faço isso lá atras? pensar nisso

    console.log("filters:", filters);
    console.log("filters.name:", filters?.name);
    console.log("filters.phone:", filters?.phone);

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

    console.log(
      toCurl(
        "GET",
        "https://api.clinicaexperts.com.br/api/v1/patients",
        config,
      ),
    );

    const response = await this.http.get(
      "https://api.clinicaexperts.com.br/api/v1/patients", // PEGAR URL DO BANCO PARA MELHOR ESCALABILIDADE
      config,
      "ClinicaExpertsPatientRepository.list",
    );

    return response.data; // DEFINIR INTERFACES DE RESPOSTA PARA MELHOR ESCALABILIDADE
  }

  private mapPatient(raw: any): Patient {
    return {
      uuid: raw.uuid,
      name: raw.name,
      phone: raw.phone,
      email: raw.email,
    };
  }
}
