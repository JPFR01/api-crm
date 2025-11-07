"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskFieldsHelper = maskFieldsHelper;
exports.maskXmlFieldsHelper = maskXmlFieldsHelper;
const Error_1 = require("../../../v1/domain/shared/errors/Error");
const ObjectConstructError_1 = require("../../../v1/domain/shared/errors/ObjectConstructError");
const fast_xml_parser_1 = require("fast-xml-parser");
const SENSITIVE_PATTERNS = [
    'authorization',
    'base64',
    'bearer',
    'certificado',
    'documento',
    'file',
    'html',
    'image',
    'imagem',
    'metadado',
    'password',
    'pdf',
    'senha',
    'token',
    'secret',
    'key',
    'foto',
    'picture',
];
function maskFieldsHelper(data) {
    if (!data)
        return;
    const json = toJSONObject(data);
    if (!json)
        return;
    return safelyApplyMask(json);
}
function maskXmlFieldsHelper(xml) {
    if (!xml)
        return;
    try {
        const parser = new fast_xml_parser_1.XMLParser({ ignoreAttributes: false });
        const builder = new fast_xml_parser_1.XMLBuilder({ ignoreAttributes: false });
        return builder.build(applyMaskToSensitiveFields(parser.parse(xml)));
    }
    catch (error) {
        throw new ObjectConstructError_1.ObjectConstructError(`Method: Infrastructure.helpers.LoggerHelper - cannot mask XML - ${String(error)}`, Error_1.patternMessage);
    }
}
function safelyApplyMask(data) {
    try {
        return applyMaskToSensitiveFields(data);
    }
    catch (error) {
        throw new ObjectConstructError_1.ObjectConstructError(`Method: Infrastructure.helpers.LoggerHelper - cannot create the object - ${String(error)}`, Error_1.patternMessage);
    }
}
function toJSONObject(input) {
    if (typeof input === 'string')
        return tryParseJSONString(input);
    if (input instanceof URLSearchParams)
        return Object.fromEntries(input.entries());
    if (isJSONObject(input))
        return input;
    return undefined;
}
function tryParseJSONString(json) {
    try {
        const parsed = JSON.parse(json);
        return isJSONObject(parsed) ? parsed : undefined;
    }
    catch {
        return undefined;
    }
}
function isJSONObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isSensitiveKey(key) {
    return SENSITIVE_PATTERNS.some((pattern) => key.toLowerCase().includes(pattern.toLowerCase()));
}
function applyMaskToSensitiveFields(obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const lowerKey = key.toLowerCase();
        if (isSensitiveKey(lowerKey)) {
            acc[key] = maskValue(lowerKey, value);
        }
        else if (isJSONObject(value)) {
            acc[key] = applyMaskToSensitiveFields(value);
        }
        else {
            acc[key] = value !== null && value !== void 0 ? value : '';
        }
        return acc;
    }, {});
}
function maskValue(key, value) {
    if (key === 'authorization' && typeof value === 'string') {
        return value.replace(/(Bearer\s+)[^\s]+/, '$1*');
    }
    return '*';
}
