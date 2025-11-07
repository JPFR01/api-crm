"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckController = void 0;
const httpResponseHelper_1 = require("../../../../../v1/presentation/helpers/httpResponseHelper");
const http_helper_1 = require("../../../../../v1/presentation/helpers/http-helper");
class HealthCheckController {
    constructor(healthCheck, logger) {
        this.healthCheck = healthCheck;
        this.logger = logger;
    }
    async handle() {
        try {
            await this.logger.info({
                origem: 'v1/health-check',
                versao: 'v1',
                destino: 'health-check',
                classe: 'HealthCheckController',
                headerLog: { 'device-id': {} },
            });
            return (0, http_helper_1.ok)({ status: await this.healthCheck.check() });
        }
        catch (error) {
            return (0, httpResponseHelper_1.httpResponseHelper)(error, '', 'v1/health-check', 'health-check', 'HealthCheckController');
        }
    }
}
exports.HealthCheckController = HealthCheckController;
