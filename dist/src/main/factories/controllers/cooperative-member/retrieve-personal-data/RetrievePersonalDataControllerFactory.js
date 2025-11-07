"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrievePersonalDataControllerFactory = void 0;
const RetrievePersonalDataFactory_1 = require("../../../../../../main/factories/entities/cooperative-member/retrieve-personal-data/RetrievePersonalDataFactory");
const LoggerFactory_1 = require("../../../../../../main/factories/repository/logger/LoggerFactory");
const RetrievePersonalDataController_1 = require("../../../../../../v1/presentation/controllers/cooperative-member/retrieve-personal-data/RetrievePersonalDataController");
const RetrievePersonalDataControllerFactory = () => {
    return new RetrievePersonalDataController_1.RetrievePersonalDataController((0, RetrievePersonalDataFactory_1.RetrievePersonalDataFactory)(), (0, LoggerFactory_1.LoggerFactory)());
};
exports.RetrievePersonalDataControllerFactory = RetrievePersonalDataControllerFactory;
