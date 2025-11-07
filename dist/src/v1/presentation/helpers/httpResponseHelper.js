"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpResponseHelper = httpResponseHelper;
const LoggerFactory_1 = require("../../../../main/factories/repository/logger/LoggerFactory");
const FormatUtils_1 = require("../../../../v1/application/helpers/FormatUtils");
const errors_1 = require("../../../../v1/domain/shared/errors");
const Error_1 = require("../../../../v1/domain/shared/errors/Error");
const InvalidHeaderError_1 = require("../../../../v1/domain/shared/errors/InvalidHeaderError");
const JsonWebTokenError_1 = require("../../../../v1/domain/shared/errors/JsonWebTokenError");
const UnassignedError_1 = require("../../../../v1/domain/shared/errors/UnassignedError");
const http_helper_1 = require("../../../../v1/presentation/helpers/http-helper");
const logger = (0, LoggerFactory_1.LoggerFactory)();
function httpResponseHelper(error, data, origin, destiny, controller) {
    var _a, _b;
    const treatedError = new Error_1.Error(error);
    const httpResponse = errorValidator(error, treatedError);
    if (data)
        logger.error({
            origem: origin,
            versao: 'v1',
            destino: destiny,
            classe: controller,
            body: (_b = (_a = data.data) !== null && _a !== void 0 ? _a : data.body) !== null && _b !== void 0 ? _b : data,
            erro: error.stack,
            status: httpResponse.statusCode,
        });
    return httpResponse;
}
function errorValidator(error, treatedError) {
    switch (error.constructor) {
        case JsonWebTokenError_1.JsonWebTokenError:
        case errors_1.AuthenticationError:
        case errors_1.ExpiredJwtError:
        case errors_1.PermissionError:
        case errors_1.KeycloakTokenError:
            return (0, http_helper_1.unauthorized)(treatedError);
        case errors_1.InvalidAppVersionError:
        case errors_1.InvalidParamError:
            return (0, http_helper_1.badRequest)(treatedError);
        case errors_1.TimeoutConnectError:
            return (0, http_helper_1.requestTimeout)(treatedError);
        case errors_1.InvalidRefreshTokenError:
        case InvalidHeaderError_1.InvalidHeaderError:
            return (0, http_helper_1.preconditionFailed)(treatedError);
        case UnassignedError_1.UnassignedError:
            return (0, http_helper_1.unassigned)(treatedError, parseInt((0, FormatUtils_1.extractNumbers)(error.name)));
        case errors_1.NotFoundError:
            return (0, http_helper_1.notFound)(treatedError);
        case errors_1.NotImplementedError:
            return (0, http_helper_1.notImplemented)(treatedError);
        default:
            return (0, http_helper_1.serverError)(treatedError);
    }
}
