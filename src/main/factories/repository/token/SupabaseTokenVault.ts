// infrastructure/repository/token/SupabaseTokenVault.ts

export class SupabaseTokenVault {
  async get({ provider, companyId }) {
    const { data, error } = await supabase
      .from("crm_tokens")
      .select("token")
      .eq("provider", provider)
      .eq("company_id", companyId)
      .single();

    if (error || !data) return null;

    return data.token;
  }
}
