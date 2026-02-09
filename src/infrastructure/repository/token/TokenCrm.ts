import { SupabaseTokenVault } from "@/main/factories/repository/token/SupabaseTokenVault";
import { TokenCRM } from "@/v1/domain/repository/token/Token";

type TokenCrmFactoryParams = {
  provider: "clinica_experts" | "hubspot";
  companyId: string;
  vault: SupabaseTokenVault; // agora você injeta o vault
};

// Cache em memória
const tokenCache: Record<string, { token: string; expiresAt: number }> = {};

export class TokenCrm implements TokenCRM {
  private provider: "clinica_experts" | "hubspot";
  private companyId: string;
  private vault: SupabaseTokenVault;

  constructor(params: TokenCrmFactoryParams) {
    this.provider = params.provider;
    this.companyId = params.companyId;
    this.vault = params.vault;
  }

  async getToken(): Promise<string> {
    const cacheKey = `${this.provider}:${this.companyId}`;
    const cached = tokenCache[cacheKey];

    // Retorna token do cache se ainda válido
    if (cached && cached.expiresAt > Date.now()) {
      return cached.token;
    }

    // Busca token no vault (Supabase)
    const tokenFromVault = await this.vault.get({
      provider: this.provider,
      companyId: this.companyId,
    });

    if (!tokenFromVault) {
      throw new Error(
        `Token CRM não encontrado no Vault para ${this.provider}:${this.companyId}`,
      );
    }

    // Salva no cache e retorna
    const expiresAt = Date.now() + 60 * 60 * 1000 - 5000; // assume 1h
    tokenCache[cacheKey] = { token: tokenFromVault, expiresAt };

    return tokenFromVault;
  }
}
