import {HttpStatusCode} from 'axios';
import {JSONObject} from '../shared/types/jsonTypes';

export type LoggerLevel = 'info' | 'warn' | 'error' | 'http' | 'verbose' | 'debug' | 'silly';

export interface LoggerLogData {
    tipo?: string;
    origem?: string;
    versao?: 'v1' | string;
    destino?: string;
    classe?: string;
    headerLog?: any;
    body?: any;
    requestParam?: any;
    pathVariable?: string;
    erro?: string | JSONObject;
    payload?: string;
    response?: any;
    status?: HttpStatusCode;
}
export interface Logger {
    log(data: LoggerLogData, level: LoggerLevel): Promise<void>;
    info(data: LoggerLogData): Promise<void>;
    warn(data: LoggerLogData): Promise<void>;
    error(data: LoggerLogData): Promise<void>;
    debug(data: LoggerLogData): Promise<void>;
}
