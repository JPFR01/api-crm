import {patternMessage} from '@/v1/domain/shared/errors/Error';
import {ObjectConstructError} from '@/v1/domain/shared/errors/ObjectConstructError';
import {JSONObject} from '@/v1/domain/shared/types/jsonTypes';
import {XMLParser, XMLBuilder} from 'fast-xml-parser';

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

export function maskFieldsHelper(data: unknown): JSONObject | undefined {
    if (!data) return;

    const json: JSONObject | undefined = toJSONObject(data);
    if (!json) return;

    return safelyApplyMask(json);
}

export function maskXmlFieldsHelper(xml: string): string | undefined {
    if (!xml) return;

    try {
        const parser: XMLParser = new XMLParser({ignoreAttributes: false});
        const builder: XMLBuilder = new XMLBuilder({ignoreAttributes: false});
        return builder.build(applyMaskToSensitiveFields(parser.parse(xml)));
    } catch (error) {
        throw new ObjectConstructError(`Method: Infrastructure.helpers.LoggerHelper - cannot mask XML - ${String(error)}`, patternMessage);
    }
}

function safelyApplyMask(data: JSONObject): JSONObject {
    try {
        return applyMaskToSensitiveFields(data);
    } catch (error) {
        throw new ObjectConstructError(`Method: Infrastructure.helpers.LoggerHelper - cannot create the object - ${String(error)}`, patternMessage);
    }
}

function toJSONObject(input: unknown): JSONObject | undefined {
    if (typeof input === 'string') return tryParseJSONString(input);
    if (input instanceof URLSearchParams) return Object.fromEntries(input.entries());
    if (isJSONObject(input)) return input;
    return undefined;
}

function tryParseJSONString(json: string): JSONObject | undefined {
    try {
        const parsed: any = JSON.parse(json);
        return isJSONObject(parsed) ? parsed : undefined;
    } catch {
        return undefined;
    }
}

function isJSONObject(value: unknown): value is JSONObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSensitiveKey(key: string): boolean {
    return SENSITIVE_PATTERNS.some((pattern) => key.toLowerCase().includes(pattern.toLowerCase()));
}

function applyMaskToSensitiveFields(obj: JSONObject): JSONObject {
    return Object.entries(obj).reduce<JSONObject>((acc, [key, value]) => {
        const lowerKey: string = key.toLowerCase();

        if (isSensitiveKey(lowerKey)) {
            acc[key] = maskValue(lowerKey, value);
        } else if (isJSONObject(value)) {
            acc[key] = applyMaskToSensitiveFields(value);
        } else {
            acc[key] = value ?? '';
        }

        return acc;
    }, {});
}

function maskValue(key: string, value: unknown): string {
    if (key === 'authorization' && typeof value === 'string') {
        return value.replace(/(Bearer\s+)[^\s]+/, '$1*');
    }
    return '*';
}
