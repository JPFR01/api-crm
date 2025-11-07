"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressRouteAdapter_1 = require("../../../main/adapter/express/expressRouteAdapter");
const CreatePatientControllerFactory_1 = require("../factories/controllers/patient/create-patient/CreatePatientControllerFactory");
exports.default = (router) => {
    router.post('/v1/patients/createPatient', (0, expressRouteAdapter_1.adaptRoute)((0, CreatePatientControllerFactory_1.CreatePatientControllerFactory)()));
};
