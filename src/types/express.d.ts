// Isso "estende" o tipo Request do Express
export type CrmContext = {
  provider: CrmProvider;
  companyId: string;
};

declare module "express-serve-static-core" {
  interface Request {
    crmContext?: CrmContext; // adiciona sua propriedade personalizada
  }
}
