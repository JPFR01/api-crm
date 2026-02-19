import {
  ListHealthcareCompanies as _ListHealthcareCompanies,
  ListHealthcareCompaniesRequest,
  ListHealthcareCompaniesResponse,
} from "@/v1/domain/entities/crm/healthcare-companies/list-healthcare-companies/ListHealthcareCompanies";
import { HealthcareCompaniesRepository } from "@/v1/domain/entities/crm/healthcare-companies/HealthcareCompaniesRepository";

export class ListHealthcareCompanies implements _ListHealthcareCompanies {
  constructor(
    private readonly healthcareCompaniesRepository: HealthcareCompaniesRepository,
  ) {}

  async execute(
    request: ListHealthcareCompaniesRequest,
  ): Promise<ListHealthcareCompaniesResponse> {
    const data = await this.healthcareCompaniesRepository.list(
      request.providerUrl,
    );

    return {
      data,
      meta: {
        from: 1,
        to: data.length,
        of: data.length,
        page: 1,
        per_page: 100,
        last_page: 1,
        sort_column: "healthcare_companies.description",
        sort_direction: "asc",
      },
    };
  }
}
