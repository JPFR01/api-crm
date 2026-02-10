import { supabase } from "@/infrastructure/repository/token/supabaseClient";

export class SupabaseTokenVault {
  async get({
    providerId,
    companyId,
  }: {
    providerId: string;
    companyId: string;
  }) {
    try {
      // 1️⃣ pega o vault_key_name da tabela pública
      const { data: companyProvider, error: cpError } = await supabase
        .from("companies_providers")
        .select("vault_key_name")
        .eq("company_id", companyId)
        .eq("provider_id", providerId)
        .single();

      if (cpError || !companyProvider) return null;

      const vaultKeyName = companyProvider.vault_key_name;

      // 2️⃣ chama a Edge Function para pegar o segredo
      const { data, error } = await supabase.functions.invoke(
        "get-vault-secret",
        {
          body: { vaultKeyName }, // ⚡ body deve ser JSON com o nome do segredo
        },
      );

      if (error || !data) return null;

      // 3️⃣ retorna apenas o token secreto
      return data.secret as string;
    } catch (err) {
      console.error("Erro ao buscar token via Edge Function:", err);
      return null;
    }
  }
}
