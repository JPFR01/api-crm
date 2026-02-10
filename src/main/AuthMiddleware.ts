import { createClient } from "@supabase/supabase-js";
import { Request, Response, NextFunction } from "express";
// AQUI, PARA ACESSAR MINHA API, GERAR TOKEN BASICO, SEM NADA DE VIAGEM JWT.
// ESSE TOKEN FIXO SERA USADO POR TODAS AS CLINICAS, E TODAS AS CLINICAS EM CADA REQUEST DO N8N DEVEM PASSAR SEU COMPANYID, SOMENTE ISSO
// A PARTIR DO COMPANYID BUSCO O PROVIDER, E CONSIGO PROCURAR A CHAVE DO PROVIDER NO VAULT.
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Tipagem do contexto que você vai adicionar ao req
interface CrmContext {
  companyId: string;
  providerId: string;
  providerName: string;
}

// Extender a interface Request do Express para incluir crmContext
interface AuthenticatedRequest extends Request {
  crmContext?: CrmContext;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const companyId = req.headers["x-company-id"] as string;

  //descomentar codigo abaixo de verificação de token dps
  if (token !== process.env.API_KEY) {
    return res.status(401).json({ message: "Token inválido" });
  }

  if (!companyId) {
    return res.status(400).json({ message: "companyId não informado" });
  }

  //TESTE
  //companyId = "754aabdf-3cc2-4055-b63a-cb962b1aca8c"; //company do joao

  // Buscar provider ativo
  const { data: companyProvider, error } = await supabase
    .from("companies_providers")
    .select(
      `
    provider_id,
    providers!inner(name)
  `,
    )
    .eq("company_id", companyId)
    .eq("active", true)
    .single();

  if (error || !companyProvider) {
    return res.status(400).json({ message: "Provider ativo não encontrado" });
  }

  // provider_name vem da tabela providers
  req.crmContext = {
    companyId,
    providerId: companyProvider.provider_id,
    providerName: companyProvider.providers.name, // name da tabela providers
  };

  next();
};
