import {
  formatPhoneReadable,
  normalizePhone,
} from "@/infrastructure/helpers/phoneHelper";
import { HttpMethod } from "@/v1/domain/repository/HttpMethod";
import {
  Crm as _Crm,
  CreatePatientRequest,
} from "@/v1/domain/repository/crm/Crm";
import { InvalidParamError } from "@/v1/domain/shared/errors";

export class Crm implements _Crm {
  constructor(private readonly httpMethods: HttpMethod) {}

  async createClient(data: CreatePatientRequest): Promise<void> {
    try {
      const formattedData = {
        ...data,
        phone: formatPhoneReadable(data.phone),
      };

      return (
        await this.httpMethods.post(
          "https://api.clinicaexperts.com.br/api/v1/patients",
          formattedData,
          {
            headers: {
              Authorization: `Bearer ${process.env.API_CRM}`, // "Bearer xxx"
            },
          },
          "CreatePatient"
        )
      ).data;
    } catch (error: unknown) {
      if (error instanceof Error && error.stack) {
        try {
          const parsed = JSON.parse(error.stack);
          if (parsed.message) {
            error.message = parsed.message;
            throw new InvalidParamError("CreatePatient.create", parsed.message);
          }
        } catch {
          // fallback if not JSON
          throw new InvalidParamError(
            "CreatePatient.create",
            error.message || "Erro inesperado ao criar paciente."
          );
        }
      }
    }
  }
}

/* async create(data: CreatePatientData): Promise<void> {
    try {
      return (
        await this.httpMethods.post(
          "https://api.clinicaexperts.com.br/api/v1/patients",
          data,
          {
            headers: {
              Authorization: `Bearer ${process.env.API_CRM}`, // "Bearer xxx"
            },
          },
          "CreatePatient"
        )
      ).data;
    } catch (error: unknown) {
      if (error instanceof Error && error.stack) {
        try {
          const parsed = JSON.parse(error.stack);
          if (parsed.message) {
            error.message = parsed.message;
            throw new InvalidParamError("CreatePatient.create", parsed.message);
          }
        } catch {
          // fallback if not JSON
          throw new InvalidParamError(
            "CreatePatient.create",
            error.message || "Erro inesperado ao criar paciente."
          );
        }
      }
    }
  }
} */
