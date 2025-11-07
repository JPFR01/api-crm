"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
const errors_1 = require("../../../../v1/domain/shared/errors");
const InvalidParamError_1 = require("../../../../v1/domain/shared/errors/InvalidParamError");
class Permission {
    constructor(httpMethods) {
        this.httpMethods = httpMethods;
    }
    async validate(data) {
        if (!data.usernameOrEmail)
            throw new InvalidParamError_1.InvalidParamError('Method: Permission.validate - Param usernameOrEmail', 'O nome de usuário ou email deve ser informado !');
        const permissionResponse = (await this.httpMethods.get(process.env.API_PORTAL_APP_URL + `/permission/user`, {
            params: {
                username: data.usernameOrEmail,
                permission: process.env.IMAGE_PORTAL_PERMISSION,
            },
        }, 'Permission.validate')).data;
        if (!permissionResponse.hasPermission) {
            throw new errors_1.PermissionError('Method: Permission.validate - User without permission on the resource', 'O usuário informado não possui permissão para acessar este recurso, ' +
                'favor entre em contato com seu gestor ou um administrador do sistema !');
        }
    }
}
exports.Permission = Permission;
