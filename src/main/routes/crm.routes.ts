import { Router } from "express";
import { adaptRoute } from "@/main/adapter/express/expressRouteAdapter";
import { ListPatientsControllerFactory } from "../factories/controllers/crm/patients/list-patients/ListPatientsControllerFactory";
import { authMiddleware } from "../AuthMiddleware";
import { ListProfessionalsControllerFactory } from "../factories/controllers/crm/professionals/list-professionals/ListProfessionalsControllerFactory";
import { CreatePatientControllerFactory } from "../factories/controllers/crm/patients/create-patient/CreatePatientControllerFactory";

export default (router: Router): void => {
  router.get(
    "/v1/patients",
    authMiddleware,
    adaptRoute(ListPatientsControllerFactory()),
  );
  router.get(
    "/v1/professionals",
    authMiddleware,
    adaptRoute(ListProfessionalsControllerFactory()),
  );
  router.post(
    "/v1/patients",
    authMiddleware,
    adaptRoute(CreatePatientControllerFactory()),
  );
};
