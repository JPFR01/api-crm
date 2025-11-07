"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = exports.created = exports.noContent = exports.unassigned = exports.forbidden = exports.requestTimeout = exports.notFound = exports.unauthorized = exports.preconditionFailed = exports.badRequest = exports.notImplemented = exports.serverError = void 0;
const axios_1 = require("axios");
const serverError = (error) => errorHttpHelper(error, axios_1.HttpStatusCode.InternalServerError);
exports.serverError = serverError;
const notImplemented = (error) => errorHttpHelper(error, axios_1.HttpStatusCode.NotImplemented);
exports.notImplemented = notImplemented;
const badRequest = (error) => errorHttpHelper(error, axios_1.HttpStatusCode.BadRequest);
exports.badRequest = badRequest;
const preconditionFailed = (error) => errorHttpHelper(error, axios_1.HttpStatusCode.PreconditionFailed);
exports.preconditionFailed = preconditionFailed;
const unauthorized = (error) => errorHttpHelper(error, axios_1.HttpStatusCode.Unauthorized);
exports.unauthorized = unauthorized;
const notFound = (error) => errorHttpHelper(error, axios_1.HttpStatusCode.NotFound);
exports.notFound = notFound;
const requestTimeout = (error) => errorHttpHelper(error, axios_1.HttpStatusCode.RequestTimeout);
exports.requestTimeout = requestTimeout;
const forbidden = (error) => errorHttpHelper(error, axios_1.HttpStatusCode.Forbidden);
exports.forbidden = forbidden;
const unassigned = (error, code) => {
    error.status = !error.status ? code : error.status;
    return {
        statusCode: code,
        body: error,
    };
};
exports.unassigned = unassigned;
const noContent = (message) => message
    ? {
        statusCode: 204,
        body: {
            mensagem: message,
        },
    }
    : {
        statusCode: 204,
        body: {},
    };
exports.noContent = noContent;
const created = (data) => ({
    statusCode: 201,
    body: data ? { data } : undefined,
});
exports.created = created;
const ok = (data) => ({
    statusCode: 200,
    body: data ? { data } : {},
});
exports.ok = ok;
function errorHttpHelper(error, code) {
    error.status = !error.status ? code : error.status;
    return {
        statusCode: code,
        body: error,
    };
}
