import { TokenCrm } from "@/infrastructure/repository/token/TokenCrm";
import {
  TokenCRMInterface as _Token,
  CrmContextWithVault,
} from "@/v1/domain/repository/token/Token";
import { SupabaseTokenVault } from "./SupabaseTokenVault";
import { CrmContext } from "@/types/express";

export const TokenCrmFactory = ({
  providerId,
  providerName,
  companyId,
  providerUrl,
}: CrmContext): _Token => {
  const vault = new SupabaseTokenVault(); // ou outro vault futuramente desacoplado
  return new TokenCrm({
    providerId,
    providerName,
    companyId,
    providerUrl,
    vault,
  });
};
