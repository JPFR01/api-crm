import { supabase } from "@/infrastructure/repository/token/supabaseClient";

export class SupabaseTokenVault {
  async get({ provider, companyId }: { provider: string; companyId: string }) {
    try {
      const { data, error } = await supabase
        .from("companies_providers")
        .select(
          `
    token:crm_tokens(token)
  `,
        )
        .eq("company_id", companyId)
        .eq("provider_id", providerId) // você precisaria mapear "provider" para o id
        .single();

      if (error || !data) return null;
      return data.token;
    } catch (err) {
      console.error("Erro ao buscar token no Supabase:", err);
      return null;
    }
  }
}
