"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAuthParams = buildAuthParams;
exports.convertBase64ToPem = convertBase64ToPem;
function buildAuthParams(grantType, extraParams) {
    const params = new URLSearchParams();
    params.append('client_id', process.env.KEYCLOAK_NAME_CLIENT);
    params.append('client_secret', process.env.KEYCLOAK_CLIENT_KEY);
    params.append('grant_type', grantType);
    for (const [key, value] of Object.entries(extraParams)) {
        params.append(key, value);
    }
    return params;
}
function convertBase64ToPem(base64Cert) {
    const certChunks = base64Cert.match(/.{1,64}/g);
    return `-----BEGIN CERTIFICATE-----\n${certChunks === null || certChunks === void 0 ? void 0 : certChunks.join('\n')}\n-----END CERTIFICATE-----`;
}
