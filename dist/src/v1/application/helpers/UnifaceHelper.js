"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterNullUndefinedAttributes = filterNullUndefinedAttributes;
exports.unifaceBaseStructHelper = unifaceBaseStructHelper;
exports.unifaceJsonToXmlHelper = unifaceJsonToXmlHelper;
const { XMLBuilder } = require('fast-xml-parser');
function filterNullUndefinedAttributes(obj) {
    const filteredObj = {};
    for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
            filteredObj[key] = obj[key];
        }
    }
    return filteredObj;
}
function unifaceBaseStructHelper(operation, payload, header, username) {
    const baseStruct = {
        root: filterNullUndefinedAttributes({
            sistema: 'PORTAL_APP',
            usuario: username,
            operationId: operation.operationId,
            versao: operation.version,
            payload: payload,
            'alternative-url': header['alternative-url'],
            'X-Correlation-ID': header['x-correlation-id'],
            'production-redirect': header['production-redirect'],
        }),
    };
    return baseStruct;
}
function unifaceJsonToXmlHelper(baseStruct) {
    return `xml=${new XMLBuilder().build(baseStruct)}`;
}
