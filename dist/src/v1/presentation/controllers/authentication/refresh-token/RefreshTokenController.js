"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenController = void 0;
const httpResponseHelper_1 = require("../../../../../../v1/presentation/helpers/httpResponseHelper");
const http_helper_1 = require("../../../../../../v1/presentation/helpers/http-helper");
const axios_1 = require("axios");
class RefreshTokenController {
    constructor(refreshToken, logger) {
        this.refreshToken = refreshToken;
        this.logger = logger;
    }
    async handle(httpRequest) {
        const refreshTokenData = {
            refreshToken: httpRequest.body.refreshToken,
        };
        try {
            await this.logger.info({
                origem: 'Request - v1/refreshToken',
                versao: 'v1',
                destino: 'refreshToken',
                classe: 'RefreshTokenController',
                body: refreshTokenData,
            });
            await this.refreshToken.validate(refreshTokenData);
            const refreshTokenResponse = await this.refreshToken.refresh(refreshTokenData);
            await this.logger.info({
                origem: 'Response - v1/refreshToken',
                versao: 'v1',
                destino: 'refreshToken',
                classe: 'RefreshTokenController',
                body: refreshTokenData,
                response: refreshTokenResponse,
                status: axios_1.HttpStatusCode.Ok,
            });
            return (0, http_helper_1.ok)(refreshTokenResponse);
        }
        catch (error) {
            return (0, httpResponseHelper_1.httpResponseHelper)(error, refreshTokenData, 'v1/refreshToken', 'refreshToken', 'RefreshTokenController');
        }
    }
}
exports.RefreshTokenController = RefreshTokenController;
