"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = exports.patternMessage = void 0;
const NotFoundError_1 = require("./NotFoundError");
const ServerError_1 = require("./ServerError");
exports.patternMessage = 'Aguarde alguns instantes e tente novamente.';
class Error {
    constructor(error) {
        this.titulo = 'Erro';
        this.horario = new Date().getTime();
        if (error.stack.indexOf('dsErroNegocio') != -1 || error.stack.indexOf('dsErroTecnico') != -1) {
            const jsonError = JSON.parse(error.stack);
            this.status = !jsonError.codigo ? 400 : jsonError.codigo;
            this.mensagem = jsonError.dsErroNegocio;
            return;
        }
        if (error.constructor === NotFoundError_1.NotFoundError || error.constructor === ServerError_1.ServerError) {
            this.mensagem = exports.patternMessage;
            return;
        }
        this.mensagem = error.message;
    }
}
exports.Error = Error;
