"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptRoute = void 0;
const httpResponseHelper_1 = require("../../../../v1/presentation/helpers/httpResponseHelper");
const adaptRoute = (controller) => {
    return async (req, res) => {
        const httpRequest = {
            ip: req.ip,
            body: req.body,
            headers: req.headers,
            socket: req.socket,
            params: req.params,
            query: req.query,
        };
        try {
            const httpResponse = await controller.handle(httpRequest);
            if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
                return res.status(httpResponse.statusCode).json(httpResponse.body.data);
            }
            return res.status(httpResponse.statusCode).json(httpResponse.body);
        }
        catch (error) {
            return (0, httpResponseHelper_1.httpResponseHelper)(error, '', 'Express', 'CatchExpressAdaptRoute', 'ExpressAdaptRoute');
        }
    };
};
exports.adaptRoute = adaptRoute;
