import {
  CreatePatient as _CreatePatient,
  CreatePatientRequest,
} from "@/v1/domain/entities/patient/create-patient/CreatePatient";
import { HttpMethod } from "@/v1/domain/repository/HttpMethod";
import { Token } from "@/v1/domain/repository/token/Token";
import { InvalidParamError } from "@/v1/domain/shared/errors";
import { AxiosError } from "axios";

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>; // key = field name, value = list of messages
}

export class CreatePatient implements _CreatePatient {
  constructor(
    private readonly token: Token,
    private readonly httpMethods: HttpMethod
  ) {}

  async validate(data: CreatePatientRequest): Promise<void> {
    /* if (!data.cpfUsuario || extractNumbers(data.cpfUsuario).length !== 11)
      throw new InvalidParamError(
        "Method: CreatePatient.validate - Param cpfUsuario",
        "O Cpf do usuário deve ser informado corretamente !"
      ); */
    /* tokenValidationHelper(data.header, "Application CreatePatient.validate"); */
    /* 
    if (
      (await this.token.authentication(
        data.header.authorization.substring(7)
      )) !== "Active"
    )
      throw new AuthenticationError(
        "Method: CreatePatient.validate - Token de acesso expirado !",
        "Token de acesso expirado, favor realizar o login novamente!"
      ); */
  }

  async retrieve(data: CreatePatientRequest): Promise<void> {
    try {
      return (
        await this.httpMethods.post(
          "https://api.clinicaexperts.com.br/api/v1/patients",
          data,
          {
            headers: {
              Authorization: process.env.API_CRM, // "Bearer xxx"
            },
          },
          "CreatePatient"
        )
      ).data;
    } catch (error: unknown) {
      // Check if it’s an Axios error with structured response
      if ((error as AxiosError<ApiErrorResponse>).response?.data?.message) {
        const apiError = (error as AxiosError<ApiErrorResponse>).response!.data;

        // Example: throw a domain-specific error
        throw new InvalidParamError("CreatePatient.retrieve", apiError.message);
      }

      // Otherwise, generic
      throw new Error("Erro inesperado ao criar paciente.");
    }
  }
}


/* response example não é 201, adequar interface:
{
  "uuid": "30d1bc35-9696-4d8a-a1ae-d01d99feddff",
  "name": "TESTE JOÃO",
  "email": null,
  "phone": null,
  "annotation": null,
  "date_birth": null,
  "sex": null,
  "marital_status": null,
  "occupation": null,
  "active": true,
  "notifications": {
    "sms": null,
    "whatsapp": null,
    "email": null
  },
  "documents": [],
  "healthcare_companies": [],
  "origin": null,
  "contacts": [],
  "address": null,
  "tags": "",
  "created_at": "2025-11-10T15:07:12-03:00",
  "updated_at": "2025-11-10T15:07:12-03:00"
} */
