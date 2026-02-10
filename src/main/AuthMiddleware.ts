import { CrmContext } from "@/types/express";
import { createClient } from "@supabase/supabase-js";
import { Request, Response, NextFunction } from "express";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
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

  if (token !== process.env.API_KEY) {
    return res.status(401).json({ message: "Token inválido" });
  }

  if (!companyId) {
    return res.status(400).json({ message: "companyId não informado" });
  }

  const { data: companyProvider, error } = await supabase
    .from("companies_providers")
    .select(
      `
    provider_id,
    providers!inner(
      name,
      url
    )
  `,
    )
    .eq("company_id", companyId)
    .eq("active", true)
    .single();

  if (error || !companyProvider) {
    return res.status(400).json({ message: "Provider ativo não encontrado" });
  }

  req.crmContext = {
    companyId,
    providerId: companyProvider.provider_id,
    providerName: companyProvider.providers[0].name,
    providerUrl: companyProvider.providers[0].url,
  };

  next();
};
