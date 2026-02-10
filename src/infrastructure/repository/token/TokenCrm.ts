import { SupabaseTokenVault } from "@/main/factories/repository/token/SupabaseTokenVault";
import {
  CrmContextWithVault,
  TokenCRMInterface,
} from "@/v1/domain/repository/token/Token";
import { InvalidParamError } from "@/v1/domain/shared/errors";

// Cache em memória
const tokenCache: Record<string, { token: string; expiresAt: number }> = {};

export class TokenCrm implements TokenCRMInterface {
  private providerId: string;
  private companyId: string;
  private vault: SupabaseTokenVault;

  constructor(params: CrmContextWithVault) {
    this.providerId = params.providerId;
    this.companyId = params.companyId;
    this.vault = params.vault;
  }

  async getToken(): Promise<string> {
    const cacheKey = `${this.providerId}:${this.companyId}`;
    const cached = tokenCache[cacheKey];

    // Retorna token do cache se ainda válido
    if (cached && cached.expiresAt > Date.now()) {
      return cached.token;
    }

    // Busca token no vault (Supabase), eu ja estou buscando la atras, nao acho necessário buscar aqui as vezes, ou pode ser bom
    const tokenFromVault = await this.vault.get({
      providerId: this.providerId,
      companyId: this.companyId,
    });

    if (!tokenFromVault) {
      throw new InvalidParamError(
        "Method: TOKEN CRM",
        `Token CRM não encontrado no Vault para ${this.providerId}:${this.companyId}`,
      );
    }

    // Salva no cache e retorna
    const expiresAt = Date.now() + 60 * 60 * 1000 - 5000; // assume 1h
    tokenCache[cacheKey] = { token: tokenFromVault, expiresAt };

    return tokenFromVault;
  }
}
