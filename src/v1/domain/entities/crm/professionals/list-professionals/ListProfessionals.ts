import { Header } from "@/infrastructure/helpers/HeaderHelper";

export interface ListProfessionalsRequest {
  name: string;
  email?: string;
  phone?: string;
  header: Header;
}

export interface ListProfessionalsRequest {
  filters?: {
    name?: string;
    email?: string;
    phone?: string;
    active?: boolean;
  };
  providerUrl: string;
}

export interface Professional {
  uuid: string;
  name: string;
  email: string;
  phone: string;
}

export interface ListProfessionalsResponse {
  data: Professional[];
}

export interface ListProfessionals {
  execute(
    request: ListProfessionalsRequest,
  ): Promise<ListProfessionalsResponse>;
}
