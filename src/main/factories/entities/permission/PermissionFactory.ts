import {Permission} from '@/infrastructure/repository/permission/Permission';
import {Permission as _Permission} from '@/v1/domain/repository/permission/Permission';
import {HttpMethodFactory} from '../../repository/http-methods/HttpMethodFactory';

export const PermissionFactory = (): _Permission => {
    return new Permission(HttpMethodFactory());
};
