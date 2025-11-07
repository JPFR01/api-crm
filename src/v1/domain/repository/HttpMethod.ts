import {HttpResponse} from '@/v1/presentation/protocols/Http';
import {AxiosError, AxiosRequestConfig} from 'axios';

export interface UnifaceBaseStruct {
    root: {
        sistema?: string;
        operationId?: string;
        versao?: string;
        'device-os'?: string;
        'device-id'?: string;
        'X-Correlation-ID'?: string;
        'alternative-url'?: string;
        'production-redirect'?: string;
        payload?: any;
        username?: string;
    };
}

export interface HttpMethod {
    get: (url: string, config?: AxiosRequestConfig, caller?: string) => Promise<HttpResponse>;
    post: <T = unknown>(url: string, request: T, config?: AxiosRequestConfig, caller?: string) => Promise<HttpResponse>;
    unifacePost: (url: string, request: UnifaceBaseStruct, caller: string) => Promise<HttpResponse>;
    put: <T = unknown>(url: string, request: T, config?: AxiosRequestConfig, caller?: string) => Promise<HttpResponse>;
    delete: (url: string, config?: AxiosRequestConfig, caller?: string) => Promise<HttpResponse>;
    errorHandler: (error: AxiosError, method: string, url: string) => Promise<Error>;
}
