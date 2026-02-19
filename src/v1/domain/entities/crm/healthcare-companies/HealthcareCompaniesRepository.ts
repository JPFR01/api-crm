import { HealthcareCompany } from "./list-healthcare-companies/ListHealthcareCompanies";

export interface HealthcareCompaniesRepository {
  list(providerUrl: string): Promise<HealthcareCompany[]>;
}
