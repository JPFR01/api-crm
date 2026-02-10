// Isso "estende" o tipo Request do Express
export type CrmContext = {
  providerId: string;
  providerName: string;
  companyId: string;
  providerUrl: string;
};

declare module "express-serve-static-core" {
  interface Request {
    crmContext?: CrmContext; // adiciona sua propriedade personalizada
  }
}
