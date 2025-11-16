import { Crm } from "@/infrastructure/repository/crm/Crm";
import { Crm as _Crm } from "@/v1/domain/repository/crm/Crm";
import { HttpMethodFactory } from "../http-methods/HttpMethodFactory";

export const CrmFactory = (): _Crm => {
  return new Crm(HttpMethodFactory());
};
