import {HttpResponse} from '@/v1/presentation/protocols/Http';
import {HttpMethod as Http, UnifaceBaseStruct} from '@/v1/domain/repository/HttpMethod';
import {AuthenticationError, InvalidParamError, NotFoundError, NotImplementedError, ServerError} from '@/v1/domain/shared/errors';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {unifaceJsonToXmlHelper} from '@/v1/application/helpers/UnifaceHelper';
import {UnassignedError} from '@/v1/domain/shared/errors/UnassignedError';
import {Logger} from '@/v1/domain/repository/Logger';
import {unifaceHeader} from '@/infrastructure/helpers/axiosHelpers';
import {getAuthErrorMessage, isExpiredTokenError} from '@/infrastructure/helpers/HttpMethodErrorHelpers';

export class HttpMethod implements Http {
    constructor(private readonly logger: Logger) {}

    async unifacePost(url: string, request: UnifaceBaseStruct, caller: string): Promise<HttpResponse> {
        try {
            await this.logger.info({
                origem: `Request-${request.root.operationId}`,
                versao: 'v1',
                destino: request.root.operationId,
                classe: `HttpMethod.unifacePost.${caller}`,
                body: request.root.payload,
                payload: unifaceJsonToXmlHelper(request),
            });

            return await axios.post(url, unifaceJsonToXmlHelper(request), unifaceHeader);
        } catch (error: unknown | any) {
            throw await this.errorHandler(error, 'unifacePost');
        }
    }

    async post<T = unknown>(url: string, data: T, config?: AxiosRequestConfig, caller?: string): Promise<HttpResponse> {
        try {
            const response: AxiosResponse<any, any> = await axios.post(url, data, config);
            const bodyToLog: any = typeof data === 'object' && data !== null && 'body' in data ? (data as any).body : data;

            await this.logger.info({
                origem: `Response-Post-${caller}`,
                versao: 'v1',
                destino: url,
                classe: `HttpMethod.post.${caller}`,
                body: bodyToLog,
                response: response.data,
                status: response.status,
            });

            return response;
        } catch (error: unknown | any) {
            throw await this.errorHandler(error, 'post');
        }
    }

    async get(url: string, config?: AxiosRequestConfig, caller?: string): Promise<HttpResponse> {
        try {
            const response: AxiosResponse<any, any> = await axios.get(url, config);

            await this.logger.info({
                origem: `Response-Get-${caller}`,
                versao: 'v1',
                destino: url,
                classe: `HttpMethod.get.${caller}`,
                response: response.data,
                status: response.status,
            });

            return response.data;
        } catch (error: unknown | any) {
            throw await this.errorHandler(error, 'get');
        }
    }

    async delete(url: string, config?: AxiosRequestConfig, caller?: string): Promise<HttpResponse> {
        try {
            const response: AxiosResponse<any, any> = await axios.delete(url, config);

            await this.logger.info({
                origem: `Response-Delete-${caller}`,
                versao: 'v1',
                destino: url,
                classe: `HttpMethod.delete.${caller}`,
                response: response.data,
                status: response.status,
            });

            return response.data;
        } catch (error: unknown | any) {
            throw await this.errorHandler(error, 'delete');
        }
    }

    async put<T = unknown>(url: string, data: T, config?: AxiosRequestConfig, caller?: string): Promise<HttpResponse> {
        try {
            const response: AxiosResponse<any, any> = await axios.put(url, data, config);
            const bodyToLog: any = typeof data === 'object' && data !== null && 'body' in data ? (data as any).body : data;

            await this.logger.info({
                origem: `Response-Put-${caller}`,
                versao: 'v1',
                destino: url,
                classe: `HttpMethod.put.${caller}`,
                body: bodyToLog,
                response: response.data,
                status: response.status,
            });

            return response.data;
        } catch (error: unknown | any) {
            throw await this.errorHandler(error, 'put');
        }
    }

    async errorHandler(error: AxiosError, method: string): Promise<Error> {
        const responseData: unknown = error.response?.data;
        const responseStatus: number | undefined = error.response?.status;

        let status: number = error.status ?? responseStatus ?? 500;

        if (method === 'unifacePost') {
            const codigo: any =
                typeof responseData === 'object' && responseData !== null ? (responseData as Record<string, any>)['codigo'] : undefined;
            status = codigo ?? responseStatus ?? 500;
        }

        switch (status) {
            case 452:
            case 453:
            case 454:
                return new UnassignedError(JSON.stringify(responseData), String(status));
            case 401:
                return new AuthenticationError(JSON.stringify(responseData), getAuthErrorMessage(responseData));
            case 400:
            case 422:
                if (isExpiredTokenError(responseData)) {
                    return new AuthenticationError(JSON.stringify(responseData), 'Token informado é inválido !');
                }
                return new InvalidParamError(JSON.stringify(responseData));
            case 404:
                return new NotFoundError(JSON.stringify(error), error.message);
            case 501:
                return new NotImplementedError(JSON.stringify(responseData));
            default:
                return new ServerError(JSON.stringify(responseData));
        }
    }
}
