import {HttpMethod} from '@/infrastructure/repository/http-methods/HttpMethod';
import {HttpMethod as _HttpMethod} from '@/v1/domain/repository/HttpMethod';
import {LoggerFactory} from '../logger/LoggerFactory';

export const HttpMethodFactory = (): _HttpMethod => {
    return new HttpMethod(LoggerFactory());
};
