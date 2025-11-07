"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrievePersonalDataController = void 0;
const httpResponseHelper_1 = require("../../../../../../v1/presentation/helpers/httpResponseHelper");
const http_helper_1 = require("../../../../../../v1/presentation/helpers/http-helper");
const axios_1 = require("axios");
class RetrievePersonalDataController {
    constructor(personalData, logger) {
        this.personalData = personalData;
        this.logger = logger;
    }
    async handle(httpRequest) {
        const personalDataRequest = {
            cpfUsuario: httpRequest.body.cpfUsuario,
            header: httpRequest.headers,
        };
        try {
            await this.logger.info({
                origem: 'v1/usuarios/recuperarDadosPessoais',
                versao: 'v1',
                destino: 'recuperarDadosPessoais',
                classe: 'RetrievePersonalDataController',
                headerLog: { 'device-id': personalDataRequest.header['device-id'] },
                body: personalDataRequest,
            });
            await this.personalData.validate(personalDataRequest);
            const personalDataResponse = await this.personalData.retrieve(personalDataRequest);
            await this.logger.info({
                origem: 'Response - v1/usuarios/recuperarDadosPessoais',
                versao: 'v1',
                destino: 'recuperarDadosPessoais',
                classe: 'RetrievePersonalDataController',
                body: personalDataRequest,
                response: personalDataResponse,
                status: axios_1.HttpStatusCode.Ok,
            });
            return (0, http_helper_1.ok)(personalDataResponse);
        }
        catch (error) {
            return (0, httpResponseHelper_1.httpResponseHelper)(error, personalDataRequest, 'v1/usuarios/recuperarDadosPessoais', 'recuperarDadosPessoais', 'RetrievePersonalDataController');
        }
    }
}
exports.RetrievePersonalDataController = RetrievePersonalDataController;
