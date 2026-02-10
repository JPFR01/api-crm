import { CrmContext } from "@/types/express";
import { createClient } from "@supabase/supabase-js";
import { Request, Response, NextFunction } from "express";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_KEY não configurados");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

type CompanyProviderRow = {
  provider_id: string;
  providers: {
    name: string;
    url: string;
  };
};

interface AuthenticatedRequest extends Request {
  crmContext?: CrmContext;
}

async function fetchCompanyProvider(companyId: string) {
  return supabase
    .from("companies_providers")
    .select(`provider_id, providers!inner(name, url)`)
    .eq("company_id", companyId)
    .eq("active", true)
    .maybeSingle<CompanyProviderRow>();
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("TIMEOUT")), ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function safeHeader(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = safeHeader(req.headers.authorization)?.replace("Bearer ", "");
    const companyId = safeHeader(req.headers["x-company-id"]);

    if (!token || token !== process.env.API_KEY) {
      return res.status(401).json({ message: "Token inválido" });
    }

    if (!companyId) {
      return res.status(400).json({ message: "companyId não informado" });
    }

    const { data: companyProvider, error } = await withTimeout(
      fetchCompanyProvider(companyId),
      8000,
    );

    if (error || !companyProvider) {
      console.error("Provider lookup error:", {
        companyId,
        error: error?.message,
      });
      return res.status(400).json({ message: "Provider ativo não encontrado" });
    }

    if (!companyProvider.providers) {
      return res.status(400).json({ message: "Provider inconsistente" });
    }

    req.crmContext = {
      companyId,
      providerId: companyProvider.provider_id,
      providerName: companyProvider.providers.name,
      providerUrl: companyProvider.providers.url,
    };

    return next();
  } catch (err: any) {
    if (err?.message === "TIMEOUT") {
      console.error("Supabase timeout");
      return res.status(504).json({ message: "Timeout ao buscar provider" });
    }

    console.error("authMiddleware fatal error:", err);
    return res.status(500).json({ message: "Erro interno" });
  }
};
