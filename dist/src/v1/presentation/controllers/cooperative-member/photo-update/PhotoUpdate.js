"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoUpdateController = void 0;
const httpResponseHelper_1 = require("../../../../../../v1/presentation/helpers/httpResponseHelper");
const http_helper_1 = require("../../../../../../v1/presentation/helpers/http-helper");
const axios_1 = require("axios");
class PhotoUpdateController {
    constructor(photoUpdate, logger) {
        this.photoUpdate = photoUpdate;
        this.logger = logger;
    }
    async handle(httpRequest) {
        const photoUpdateData = {
            body: httpRequest.body,
            header: httpRequest.headers,
        };
        try {
            await this.logger.info({
                origem: 'Request - v1/usuarios/alterarFoto',
                versao: 'v1',
                destino: 'alterarFoto',
                classe: 'PhotoUpdateController',
                headerLog: { 'device-id': photoUpdateData.header['device-id'] },
                body: photoUpdateData,
            });
            await this.photoUpdate.validate(photoUpdateData);
            await this.photoUpdate.update(photoUpdateData);
            await this.logger.info({
                origem: 'Response - v1/usuarios/alterarFoto',
                versao: 'v1',
                destino: 'alterarFoto',
                classe: 'PhotoUpdateController',
                headerLog: { 'device-id': photoUpdateData.header['device-id'] },
                body: photoUpdateData,
                response: {},
                status: axios_1.HttpStatusCode.NoContent,
            });
            return (0, http_helper_1.noContent)();
        }
        catch (error) {
            return (0, httpResponseHelper_1.httpResponseHelper)(error, photoUpdateData, 'v1/usuarios/alterarFoto', 'alterarFoto', 'PhotoUpdateController');
        }
    }
}
exports.PhotoUpdateController = PhotoUpdateController;
