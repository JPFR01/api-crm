import { Professional } from "../crm/professionals/list-professionals/ListProfessionals";

export type ProfessionalFilters = {
  name?: string;
  uuid?: string;
  phone?: string;
  active?: boolean;
};

export interface ProfessionalRepository {
  list(
    providerUrl: string,
    filters?: ProfessionalFilters,
  ): Promise<Professional[]>;
}
