import {Header} from '@/infrastructure/helpers/HeaderHelper';
import {UnifaceBaseStruct} from '@/v1/domain/repository/HttpMethod';
const {XMLBuilder} = require('fast-xml-parser');

interface UnifaceOperation {
    operationId?: string;
    version?: string;
}

export function filterNullUndefinedAttributes(obj: Record<string, any>): Record<string, any> {
    const filteredObj: Record<string, any> = {};
    for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
            filteredObj[key] = obj[key];
        }
    }
    return filteredObj;
}

export function unifaceBaseStructHelper(operation: UnifaceOperation, payload: any, header: Header, username?: string): UnifaceBaseStruct {
    const baseStruct: UnifaceBaseStruct = {
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

export function unifaceJsonToXmlHelper(baseStruct: UnifaceBaseStruct): string {
    return `xml=${new XMLBuilder().build(baseStruct)}`;
}
