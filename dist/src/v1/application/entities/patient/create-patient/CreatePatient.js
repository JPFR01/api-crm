"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePatient = void 0;
const FormatUtils_1 = require("../../../../../../v1/application/helpers/FormatUtils");
const TokenHelper_1 = require("../../../../../../v1/application/helpers/TokenHelper");
const UnifaceHelper_1 = require("../../../../../../v1/application/helpers/UnifaceHelper");
const errors_1 = require("../../../../../../v1/domain/shared/errors");
class CreatePatient {
    constructor(token, httpMethods) {
        this.token = token;
        this.httpMethods = httpMethods;
    }
    async validate(data) {
        if (!data.cpfUsuario || (0, FormatUtils_1.extractNumbers)(data.cpfUsuario).length !== 11)
            throw new errors_1.InvalidParamError('Method: CreatePatient.validate - Param cpfUsuario', 'O Cpf do usuário deve ser informado corretamente !');
        (0, TokenHelper_1.tokenValidationHelper)(data.header, 'Application CreatePatient.validate');
        if ((await this.token.authentication(data.header.authorization.substring(7))) !== 'Active')
            throw new errors_1.AuthenticationError('Method: CreatePatient.validate - Token de acesso expirado !', 'Token de acesso expirado, favor realizar o login novamente!');
    }
    async retrieve(data) {
        var _a;
        const openedToken = await this.token.open(data.header.authorization.substring(7));
        return (await this.httpMethods.unifacePost(`${process.env.UNIFACE_URL}/pcopd001`, (0, UnifaceHelper_1.unifaceBaseStructHelper)({ operationId: 'criarPaciente', version: 'v1' }, { cpfUsuario: (0, FormatUtils_1.extractNumbers)(data.cpfUsuario) }, data.header, (0, FormatUtils_1.extractUsername)((_a = openedToken.preferred_username) !== null && _a !== void 0 ? _a : openedToken.email)), 'CreatePatient')).data;
    }
}
exports.CreatePatient = CreatePatient;
