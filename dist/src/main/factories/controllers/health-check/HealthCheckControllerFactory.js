"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckControllerFactory = void 0;
const LoggerFactory_1 = require("../../../../../main/factories/repository/logger/LoggerFactory");
const ApplicationHealthController_1 = require("../../../../../v1/presentation/controllers/health-check/ApplicationHealthController");
const HealthCheckFactory_1 = require("../../../../../main/factories/entities/health-check/HealthCheckFactory");
const HealthCheckControllerFactory = () => {
    return new ApplicationHealthController_1.HealthCheckController((0, HealthCheckFactory_1.HealthCheckFactory)(), (0, LoggerFactory_1.LoggerFactory)());
};
exports.HealthCheckControllerFactory = HealthCheckControllerFactory;
