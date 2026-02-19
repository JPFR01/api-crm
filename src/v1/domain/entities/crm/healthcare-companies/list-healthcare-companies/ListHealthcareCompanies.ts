export interface HealthcareCompany {
  uuid: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListHealthcareCompaniesRequest {
  providerUrl: string;
}

export interface ListHealthcareCompaniesResponse {
  data: HealthcareCompany[];
  meta?: {
    from: number;
    to: number;
    of: number;
    page: number;
    per_page: number;
    last_page: number;
    sort_column: string;
    sort_direction: string;
  };
}

export interface ListHealthcareCompanies {
  execute(
    request: ListHealthcareCompaniesRequest,
  ): Promise<ListHealthcareCompaniesResponse>;
}
