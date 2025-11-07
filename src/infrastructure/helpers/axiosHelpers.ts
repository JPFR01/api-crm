import {AxiosRequestConfig} from 'axios';

export function headers(authorization: string): AxiosRequestConfig<any> {
    return {
        headers: {
            authorization: `Bearer ${authorization}`,
        },
        timeout: 15000,
    };
}

export const unifaceHeader: AxiosRequestConfig<string> = {
    headers: {
        'Content-Type': 'text/plain',
    },
    timeout: 15000,
};

export const keycloakHeader: AxiosRequestConfig<string> = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 15000,
};
