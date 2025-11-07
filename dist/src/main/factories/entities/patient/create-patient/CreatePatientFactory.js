"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePatientFactory = void 0;
const HttpMethodFactory_1 = require("../../../../../../main/factories/repository/http-methods/HttpMethodFactory");
const TokenFactory_1 = require("../../../../../../main/factories/repository/token/TokenFactory");
const CreatePatient_1 = require("../../../../../../v1/application/entities/patient/create-patient/CreatePatient");
const CreatePatientFactory = () => {
    return new CreatePatient_1.CreatePatient((0, TokenFactory_1.TokenFactory)(), (0, HttpMethodFactory_1.HttpMethodFactory)());
};
exports.CreatePatientFactory = CreatePatientFactory;
