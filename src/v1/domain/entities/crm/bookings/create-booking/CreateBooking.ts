export interface CreateBookingRequest {
  data: {
    starts_at: string;
    ends_at: string;
    status: string;
    check_availability: boolean; // default true
    professional: string; // UUID
    patient: string; // UUID
  };
  providerUrl: string;
}

export interface Booking {
  uuid: string;
  starts_at: string;
  ends_at: string;
  status: string;
  annotation: string | null;
  patient: {
    uuid: string;
    name: string;
    email: string | null;
    phone: string | null;
    annotation: string | null;
    date_birth: string | null;
    sex: string | null;
    marital_status: string | null;
    occupation: string | null;
    active: boolean;
    notifications: {
      sms: boolean;
      whatsapp_lite: boolean;
      email: boolean;
    };
    documents: any[];
    healthcare_companies: any[];
    origin: string | null;
    contacts: any[];
    address: any | null;
    tags: string;
    created_at: string;
    updated_at: string;
  };
  professional: {
    uuid: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    color: string;
    phone: string;
    annotation: string | null;
    date_birth: string | null;
    sex: string | null;
    marital_status: string | null;
    occupation: string | null;
    active: boolean;
    board: {
      code: string;
      number: string;
      state: string;
    };
    commission: {
      sale: any | null;
      consultation: {
        type: string;
        percentage: number;
        amount: number;
      };
    };
    notifications: {
      sms: boolean;
      whatsapp_lite: boolean;
      email: boolean;
      push: boolean;
    };
    address: {
      complement: string | null;
      number: string | null;
      street: string | null;
      neighborhood: string | null;
      zip_code: string | null;
      city: string | null;
      state: string | null;
      country: string | null;
    };
    tags: string;
    created_at: string;
    updated_at: string;
  };
  procedures: any[];
  rooms: any[];
  healthcare_company: any | null;
  created_at: string;
  updated_at: string;
}

export type CreateBookingResponse = Booking;

export interface CreateBooking {
  execute(request: CreateBookingRequest): Promise<CreateBookingResponse>;
}
