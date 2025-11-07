import {NotFoundError} from './NotFoundError';
import {ServerError} from './ServerError';

export const patternMessage = 'Aguarde alguns instantes e tente novamente.';

interface ErrorResponseData {
    codigo?: number;
}

interface ErrorResponse {
    status?: number;
    data?: ErrorResponseData;
}

export interface CustomError {
    status?: number;
    response?: ErrorResponse;
}

export class Error {
    status?: number;
    titulo: string;
    mensagem: string;
    horario: number;

    constructor(error: any) {
        this.titulo = 'Erro';
        this.horario = new Date().getTime();

        if (error.stack.indexOf('dsErroNegocio') != -1 || error.stack.indexOf('dsErroTecnico') != -1) {
            const jsonError: any = JSON.parse(error.stack);
            this.status = !jsonError.codigo ? 400 : jsonError.codigo;
            this.mensagem = jsonError.dsErroNegocio;
            return;
        }

        if (error.constructor === NotFoundError || error.constructor === ServerError) {
            this.mensagem = patternMessage;
            return;
        }

        this.mensagem = error.message;
    }
}
