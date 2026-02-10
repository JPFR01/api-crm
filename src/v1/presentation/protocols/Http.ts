import { CrmContext } from "@/types/express";

export interface HttpResponse {
  statusCode?: number;
  body?: any;
  data?: any;
  keys?: any;
}

export interface HttpRequest {
  body?: any;
  params?: any;
  socket?: {
    remotePort?: number;
  };
  ip?: string;
  headers?: any;
  query?: any;
  crmContext?: CrmContext;
}
