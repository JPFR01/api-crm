import {HttpMethod} from '@/v1/domain/repository/HttpMethod';
import {Permission as _Permission, PermissionData, PermissionResponse} from '@/v1/domain/repository/permission/Permission';
import {PermissionError} from '@/v1/domain/shared/errors';
import {InvalidParamError} from '@/v1/domain/shared/errors/InvalidParamError';

export class Permission implements _Permission {
    constructor(private readonly httpMethods: HttpMethod) {}

    async validate(data: PermissionData): Promise<void> {
        if (!data.usernameOrEmail)
            throw new InvalidParamError('Method: Permission.validate - Param usernameOrEmail', 'O nome de usuário ou email deve ser informado !');

        const permissionResponse: PermissionResponse = (
            await this.httpMethods.get(
                process.env.API_PORTAL_APP_URL + `/permission/user`,
                {
                    params: {
                        username: data.usernameOrEmail,
                        permission: process.env.IMAGE_PORTAL_PERMISSION,
                    },
                },
                'Permission.validate',
            )
        ).data;

        if (!permissionResponse.hasPermission) {
            throw new PermissionError(
                'Method: Permission.validate - User without permission on the resource',
                'O usuário informado não possui permissão para acessar este recurso, ' +
                    'favor entre em contato com seu gestor ou um administrador do sistema !',
            );
        }
    }
}
