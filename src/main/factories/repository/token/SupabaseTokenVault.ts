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
      // 1️⃣ buscar o nome da chave no banco público
      const { data: companyProvider, error: cpError } = await supabase
        .from("companies_providers")
        .select("vault_key_name")
        .eq("company_id", companyId)
        .eq("provider_id", providerId)
        .single();

      if (cpError || !companyProvider?.vault_key_name) {
        console.error("Vault key não encontrada", cpError);
        return null;
      }

      // 2️⃣ chamar RPC que retorna o segredo DECRIPTADO
      const { data: decryptedSecret, error: rpcError } = await supabase.rpc(
        "get_vault_secret",
        {
          p_secret_name: companyProvider.vault_key_name,
        },
      );

      if (rpcError) {
        console.error("Erro ao buscar segredo no Vault:", rpcError);
        return null;
      }

      return decryptedSecret as string;
    } catch (err) {
      console.error("Erro inesperado ao buscar token:", err);
      return null;
    }
  }
}
