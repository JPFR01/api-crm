import { HealthcareCompaniesRepositoryFactory } from "@/infrastructure/repository/crm/HealthcareCompaniesRepositoryFactory";
import { CrmContext } from "@/types/express";
import { ListHealthcareCompanies } from "@/v1/application/entities/crm/healthcare-companies/list-healthcare-companies/ListHealthcareCompanies";
import { ListHealthcareCompanies as _ListHealthcareCompanies } from "@/v1/domain/entities/crm/healthcare-companies/list-healthcare-companies/ListHealthcareCompanies";

export const ListHealthcareCompaniesFactory = (
  crmContext: CrmContext,
): _ListHealthcareCompanies => {
  return new ListHealthcareCompanies(
    HealthcareCompaniesRepositoryFactory(crmContext),
  );
};
