import { TokenCRM } from "@/v1/domain/repository/token/Token";

type TokenVault = {
  get(params: { provider: string; companyId: string }): Promise<string | null>;
};

export class CrmToken implements TokenCRM {
  constructor(
    private readonly provider: string,
    private readonly companyId: string,
    private readonly vault: TokenVault,
  ) {}

  async getToken(): Promise<string> {
    const token = await this.vault.get({
      provider: this.provider, //clinica_experts (buscar pelo nome no supabase)
      companyId: this.companyId, // uuid da clinica
    });

    if (!token) {
      throw new Error(
        `Token não encontrado para provider=${this.provider} companyId=${this.companyId}`,
      );
    }

    return token;
  }
}
