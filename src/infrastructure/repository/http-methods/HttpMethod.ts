import {HttpResponse} from '@/v1/presentation/protocols/Http';
import {HttpMethod as Http, UnifaceBaseStruct} from '@/v1/domain/repository/HttpMethod';
import {AuthenticationError, InvalidParamError, NotFoundError, NotImplementedError, ServerError, ConflictError} from '@/v1/domain/shared/errors';
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

        const message = this.extractErrorMessage(responseData);
        const stack = `HttpMethod.${method}`;

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
                // Fixing the instantiation: stack first, then message
                return new InvalidParamError(stack, message);
            case 404:
                return new NotFoundError(JSON.stringify(error), message || error.message);
            case 409:
                return new ConflictError(stack, message);
            case 501:
                return new NotImplementedError(JSON.stringify(responseData));
            default:
                return new ServerError(JSON.stringify(responseData));
        }
    }

    private extractErrorMessage(data: any): string {
        if (!data) return 'Erro inesperado';
        if (typeof data === 'string') return data;
        
        if (typeof data === 'object') {
            if (data.errors && typeof data.errors === 'object') {
                 // Format: { message: "...", errors: { ... } }
                 const failures = JSON.stringify(data.errors);
                 return data.message ? `${data.message} - ${failures}` : failures;
            }
            if (Array.isArray(data.error)) {
                // Format: { error: [ ... ] }
                return JSON.stringify(data.error);
            }
            if (data.message) return data.message;
            if (data.error) {
                return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
            }
        }
        
        return JSON.stringify(data);
    }
}
