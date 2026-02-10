import { TokenCrm } from "@/infrastructure/repository/token/TokenCrm";
import { TokenCRM as _Token } from "@/v1/domain/repository/token/Token";
import { SupabaseTokenVault } from "./SupabaseTokenVault";
import { CrmContext } from "@/types/express";

export const TokenCrmFactory = ({
  providerName,
  providerId,
  companyId,
}: CrmContext): _Token => {
  const vault = new SupabaseTokenVault(); // ou outro vault futuramente desacoplado
  return new TokenCrm({ providerName, providerId, companyId, vault });
};
