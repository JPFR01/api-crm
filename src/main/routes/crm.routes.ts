import { Router } from "express";
import { adaptRoute } from "@/main/adapter/express/expressRouteAdapter";
import { ListPatientsControllerFactory } from "../factories/controllers/crm/patients/list-patients/ListPatientsControllerFactory";
import { authMiddleware } from "../AuthMiddleware";

export default (router: Router): void => {
  router.get(
    "/v1/patients",
    authMiddleware,
    adaptRoute(ListPatientsControllerFactory()),
  );
};
