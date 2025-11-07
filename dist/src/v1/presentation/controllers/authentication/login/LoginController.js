"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const httpResponseHelper_1 = require("../../../../../../v1/presentation/helpers/httpResponseHelper");
const http_helper_1 = require("../../../../../../v1/presentation/helpers/http-helper");
const axios_1 = require("axios");
class LoginController {
    constructor(login, logger) {
        this.login = login;
        this.logger = logger;
    }
    async handle(httpRequest) {
        const loginData = {
            body: httpRequest.body,
        };
        try {
            await this.logger.info({
                origem: 'Request - v1/login',
                versao: 'v1',
                destino: 'login',
                classe: 'LoginController',
                body: loginData,
            });
            await this.login.validate(loginData);
            const LoginResponse = await this.login.login(loginData);
            await this.logger.info({
                origem: 'Response - v1/login',
                versao: 'v1',
                destino: 'login',
                classe: 'LoginController',
                body: loginData,
                response: LoginResponse,
                status: axios_1.HttpStatusCode.Ok,
            });
            return (0, http_helper_1.ok)(LoginResponse);
        }
        catch (error) {
            return (0, httpResponseHelper_1.httpResponseHelper)(error, loginData, 'v1/login', 'login', 'LoginController');
        }
    }
}
exports.LoginController = LoginController;
