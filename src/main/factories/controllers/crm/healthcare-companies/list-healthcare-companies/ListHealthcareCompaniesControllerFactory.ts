import { ListHealthcareCompaniesFactory } from "@/main/factories/entities/crm/healthcare-companies/list-healthcare-companies/ListHealthcareCompaniesFactory";
import { ListHealthcareCompaniesController } from "@/v1/presentation/controllers/crm/healthcare-companies/list-healthcare-companies/ListHealthcareCompaniesController";
import { Controller } from "@/v1/presentation/helpers/Controller";

export const ListHealthcareCompaniesControllerFactory = (): Controller => {
  return new ListHealthcareCompaniesController(ListHealthcareCompaniesFactory);
};
