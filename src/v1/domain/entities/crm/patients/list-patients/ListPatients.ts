import { Header } from "@/infrastructure/helpers/HeaderHelper";

enum SexEnum {
  F = "F",
  M = "M",
}

enum MaritalStatus {
  Single = "single",
  Married = "married",
  Divorced = "divorced",
  Widowed = "widowed",
}

interface NotificationsInterface {
  sms: boolean;
  whatsapp: boolean;
  email: boolean;
}

interface DocumentsInterface {
  type: string;
  value: string;
}

interface HealthCareCompaniesInterface {
  uuid: string;
  identification: string;
  due_date: Date;
}

interface EmergencyContactsInterface {
  type: string;
  relationshiptype: string;
}

interface ContactsInterface {
  type: string;
  relationshiptype: string;
}

interface AddressInterface {
  complement: string;
  number: string;
  street: string;
  neighborhood: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}
export interface ListPatientsRequest {
  name: string;
  email?: string;
  phone?: string;
  annotation?: string;
  date_birth?: Date;
  sex?: SexEnum;
  marital_status?: MaritalStatus;
  occupation?: string;
  active?: boolean;
  notifications?: NotificationsInterface;
  documents?: DocumentsInterface;
  healthcare_companies?: HealthCareCompaniesInterface;
  emergency_contacts?: EmergencyContactsInterface;
  origin?: string;
  origin_referrer?: string;
  contacts?: ContactsInterface;
  address?: AddressInterface;
  tags: string[];
  header: Header;
}

export interface ListPatientsRequest {
  filters?: {
    name?: string;
    email?: string;
    phone?: string;
    active?: boolean;
  };
}

export interface Patient {
  name: string;
  email: string;
  phone: string;
}

export interface ListPatientsResponse {
  patients: Patient[];
}

export interface ListPatients {
  execute(request: ListPatientsRequest): Promise<ListPatientsResponse>;
}
