"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationDocsSwaggerFactory = void 0;
const LoggerFactory_1 = require("../../../../../../main/factories/repository/logger/LoggerFactory");
const ApplicationDocsSwaggerController_1 = require("../../../../../../v1/presentation/controllers/swagger/docs/ApplicationDocsSwaggerController");
const ConfigSwagger_1 = require("../../../../../../infrastructure/swagger/configSwagger/ConfigSwagger");
const ApplicationDocsSwaggerFactory = () => {
    return new ApplicationDocsSwaggerController_1.ApplicationDocsSwaggerController(ConfigSwagger_1.ConfigSwagger, (0, LoggerFactory_1.LoggerFactory)());
};
exports.ApplicationDocsSwaggerFactory = ApplicationDocsSwaggerFactory;
