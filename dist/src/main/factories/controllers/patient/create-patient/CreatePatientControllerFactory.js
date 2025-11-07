"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePatientControllerFactory = void 0;
const CreatePatientFactory_1 = require("../../../../../../main/factories/entities/patient/create-patient/CreatePatientFactory");
const LoggerFactory_1 = require("../../../../../../main/factories/repository/logger/LoggerFactory");
const CreatePatientController_1 = require("../../../../../../v1/presentation/controllers/patient/create-patient/CreatePatientController");
const CreatePatientControllerFactory = () => {
    return new CreatePatientController_1.CreatePatientController((0, CreatePatientFactory_1.CreatePatientFactory)(), (0, LoggerFactory_1.LoggerFactory)());
};
exports.CreatePatientControllerFactory = CreatePatientControllerFactory;
