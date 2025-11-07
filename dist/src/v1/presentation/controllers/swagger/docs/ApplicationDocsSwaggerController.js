"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationDocsSwaggerController = void 0;
const httpResponseHelper_1 = require("../../../../../../v1/presentation/helpers/httpResponseHelper");
const http_helper_1 = require("../../../../../../v1/presentation/helpers/http-helper");
class ApplicationDocsSwaggerController {
    constructor(configSwagger, logger) {
        this.configSwagger = configSwagger;
        this.logger = logger;
    }
    async handle() {
        try {
            await this.logger.info({
                origem: 'v1/swagger.json',
                versao: 'v1',
                destino: 'swagger.json',
                classe: 'ApplicationDocsSwaggerJsonController',
                headerLog: { 'device-id': {} },
            });
            return (0, http_helper_1.ok)(this.configSwagger.configPreview);
        }
        catch (error) {
            return (0, httpResponseHelper_1.httpResponseHelper)(error, '', 'v1/swagger.json', 'swagger.json', 'ApplicationDocsSwaggerJsonController');
        }
    }
}
exports.ApplicationDocsSwaggerController = ApplicationDocsSwaggerController;
