"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keycloakHeader = exports.unifaceHeader = void 0;
exports.headers = headers;
function headers(authorization) {
    return {
        headers: {
            authorization: `Bearer ${authorization}`,
        },
        timeout: 15000,
    };
}
exports.unifaceHeader = {
    headers: {
        'Content-Type': 'text/plain',
    },
    timeout: 15000,
};
exports.keycloakHeader = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 15000,
};
