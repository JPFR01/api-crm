"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckFactory = void 0;
const HealthCheck_1 = require("../../../../../v1/application/entities/health-check/HealthCheck");
const HealthCheckFactory = () => {
    return new HealthCheck_1.HealthCheck();
};
exports.HealthCheckFactory = HealthCheckFactory;
