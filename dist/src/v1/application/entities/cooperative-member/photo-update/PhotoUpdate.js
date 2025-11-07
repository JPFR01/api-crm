"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoUpdate = void 0;
const FormatUtils_1 = require("../../../../../../v1/application/helpers/FormatUtils");
const TokenHelper_1 = require("../../../../../../v1/application/helpers/TokenHelper");
const UnifaceHelper_1 = require("../../../../../../v1/application/helpers/UnifaceHelper");
const errors_1 = require("../../../../../../v1/domain/shared/errors");
class PhotoUpdate {
    constructor(token, httpMethods) {
        this.token = token;
        this.httpMethods = httpMethods;
    }
    async validate(data) {
        if (!data.body.cpfUsuario || (0, FormatUtils_1.extractNumbers)(data.body.cpfUsuario).length !== 11)
            throw new errors_1.InvalidParamError('Method: PhotoUpdate.validate - Param cpfUsuario', 'O Cpf do usuário deve ser informado corretamente !');
        if (!data.body.imagemPerfil)
            throw new errors_1.InvalidParamError('Method: PhotoUpdate.validate - Param imagemPerfil', 'A imagem de perfil do usuário deve ser informada !');
        (0, TokenHelper_1.tokenValidationHelper)(data.header, 'Application PhotoUpdate.validate');
        if ((await this.token.authentication(data.header.authorization.substring(7))) !== 'Active')
            throw new errors_1.AuthenticationError('Method: PhotoUpdate.validate - expired access token !', 'Token de acesso expirado, favor realizar o login novamente!');
    }
    async update(data) {
        var _a;
        const openedToken = await this.token.open(data.header.authorization.substring(7));
        await this.httpMethods.unifacePost(`${process.env.UNIFACE_URL}/pcopd001`, (0, UnifaceHelper_1.unifaceBaseStructHelper)({ operationId: 'alterarFoto', version: 'v1' }, {
            cpfUsuario: (0, FormatUtils_1.extractNumbers)(data.body.cpfUsuario),
            imagemPerfil: data.body.imagemPerfil,
        }, data.header, (0, FormatUtils_1.extractUsername)((_a = openedToken.preferred_username) !== null && _a !== void 0 ? _a : openedToken.email)), 'PhotoUpdate');
    }
}
exports.PhotoUpdate = PhotoUpdate;
