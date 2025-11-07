import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import * as FormatUtils from '../../../helpers/FormatUtils';
import * as TokenHelper from '../../../helpers/TokenHelper';
import * as UnifaceHelper from '../../../helpers/UnifaceHelper';

import {Token} from '@/v1/domain/repository/token/Token';
import {HttpMethod, UnifaceBaseStruct} from '@/v1/domain/repository/HttpMethod';
import {
    RetrievePersonalDataRequest,
    RetrievePersonalDataResponse,
} from '@/v1/domain/entities/cooperative-member/retrieve-personal-data/RetrievePersonalData';
import {Header} from '@/infrastructure/helpers/HeaderHelper';

import {RetrievePersonalData} from './RetrievePersonalData';
import {AuthenticationError, InvalidParamError} from '@/v1/domain/shared/errors';
import {header, payloadTokenResponse} from '../../../../../../tests/mocks/data.mock';
import {HttpResponse} from '@/v1/presentation/protocols/Http';

describe('v1 application entitites retrieve-personal-data RetrievePersonalData', (): void => {
    const retrievePersonalDataRequest: RetrievePersonalDataRequest = {
        cpfUsuario: '123.456.789-01',
        header: header,
    };

    const retrievePersonalDataResponse: RetrievePersonalDataResponse = {
        codigoMatricula: 123456,
        cpfUsuario: '123.456.789-01',
        nomeUsuario: 'fake-usuario',
        fotoUsuario: 'fake-imagem',
        codigoLocalAcerto: 654321,
        nomeLocalAcerto: 'fake-local-acerto',
        dataAdmissao: new Date(),
    };

    const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {},
        data: {
            ...retrievePersonalDataResponse,
        },
        keys: {},
    };

    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('validate()', (): void => {
        let retrievePersonalData: RetrievePersonalData;

        beforeEach((): void => {
            jest.clearAllMocks();
            const token: Token = {
                authentication: jest.fn(),
                open: jest.fn(),
            } as unknown as Token;
            const httpMethods: HttpMethod = {
                unifacePost: jest.fn(),
            } as unknown as HttpMethod;
            retrievePersonalData = new RetrievePersonalData(token, httpMethods);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve ocorrer um erro se dados do cooperado estiverem vazios', async (): Promise<void> => {
            const retrievePersonalDataRequest: RetrievePersonalDataRequest = {
                cpfUsuario: '',
                header,
            };

            expect(retrievePersonalData.validate(retrievePersonalDataRequest)).rejects.toThrow(InvalidParamError);
        });

        it('deve ocorrer um erro se dados do cooperado estiverem vazios', async (): Promise<void> => {
            const retrievePersonalDataRequest: RetrievePersonalDataRequest = {
                cpfUsuario: '1.2.3',
                header,
            };

            jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('123');

            expect(retrievePersonalData.validate(retrievePersonalDataRequest)).rejects.toThrow(InvalidParamError);
        });

        it('deve ocorrer um erro de sessão inválida', async (): Promise<void> => {
            jest.spyOn(TokenHelper, 'tokenValidationHelper').mockReturnValueOnce(null);
            jest.spyOn(retrievePersonalData['token'], 'authentication').mockResolvedValueOnce('Unauthorized');

            expect(retrievePersonalData.validate(retrievePersonalDataRequest)).rejects.toThrow(AuthenticationError);
        });

        it('deve ocorrer um erro de sessão expirada', async (): Promise<void> => {
            jest.spyOn(TokenHelper, 'tokenValidationHelper').mockReturnValueOnce(null);
            jest.spyOn(retrievePersonalData['token'], 'authentication').mockResolvedValueOnce('Expired');

            expect(retrievePersonalData.validate(retrievePersonalDataRequest)).rejects.toThrow(AuthenticationError);
        });

        it('deve validar corretamente os dados para retorno de informações pessoais', async (): Promise<void> => {
            jest.spyOn(TokenHelper, 'tokenValidationHelper').mockReturnValueOnce(null);
            jest.spyOn(retrievePersonalData['token'], 'authentication').mockResolvedValueOnce('Active');

            const result = await retrievePersonalData.validate(retrievePersonalDataRequest);

            expect(result).toBeUndefined();
            expect(FormatUtils.extractNumbers).toHaveBeenCalledWith(expect.any(String));
            expect(TokenHelper.tokenValidationHelper).toHaveBeenCalledWith(expect.any(Object as Header), 'Application RetrievePersonalData.validate');
            expect(retrievePersonalData['token'].authentication).toHaveBeenCalledWith(expect.any(String));
        });
    });

    describe('retrieve()', (): void => {
        let retrievePersonalData: RetrievePersonalData;

        const baseStructUniface: UnifaceBaseStruct = {
            root: {
                sistema: 'fake-sistema',
                operationId: 'fake-operation-id',
                versao: '1.0.0',
                'device-os': 'android',
                'device-id': 'fake-device-id',
                'X-Correlation-ID': 'corr-id-123',
                'alternative-url': 'https://fake-alt-url.com',
                'production-redirect': 'https://fake-prod-redirect.com',
            },
        };

        beforeEach((): void => {
            jest.clearAllMocks();
            const token: Token = {
                authentication: jest.fn(),
                open: jest.fn(),
            } as unknown as Token;
            const httpMethods: HttpMethod = {
                unifacePost: jest.fn(),
            } as unknown as HttpMethod;
            retrievePersonalData = new RetrievePersonalData(token, httpMethods);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve atualizar a foto do cooperado com sucesso 01', async (): Promise<void> => {
            const payloadTokenResponseSimples = {...payloadTokenResponse};
            payloadTokenResponseSimples.preferred_username = undefined;

            jest.spyOn(retrievePersonalData['token'], 'open').mockResolvedValueOnce(payloadTokenResponseSimples);
            jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            jest.spyOn(FormatUtils, 'extractUsername').mockReturnValueOnce('username');
            jest.spyOn(UnifaceHelper, 'unifaceBaseStructHelper').mockReturnValueOnce(baseStructUniface);
            jest.spyOn(retrievePersonalData['httpMethods'], 'unifacePost').mockResolvedValueOnce(httpResponse);

            const result = await retrievePersonalData.retrieve(retrievePersonalDataRequest);

            expect(result).toEqual(httpResponse.data);
            expect(retrievePersonalData['token'].open).toHaveBeenCalledWith(expect.any(String));
            expect(FormatUtils.extractNumbers).toHaveBeenCalledWith(expect.any(String));
            expect(FormatUtils.extractUsername).toHaveBeenCalledWith(payloadTokenResponseSimples.email);
            expect(UnifaceHelper.unifaceBaseStructHelper).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object),
                expect.any(Object as Header),
                expect.any(String),
            );
            expect(retrievePersonalData['httpMethods'].unifacePost).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Object as unknown as UnifaceBaseStruct),
                expect.any(String),
            );
        });

        it('deve atualizar a foto do cooperado com sucesso 02', async (): Promise<void> => {
            jest.spyOn(retrievePersonalData['token'], 'open').mockResolvedValueOnce(payloadTokenResponse);
            jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            jest.spyOn(FormatUtils, 'extractUsername').mockReturnValueOnce('username');
            jest.spyOn(UnifaceHelper, 'unifaceBaseStructHelper').mockReturnValueOnce(baseStructUniface);
            jest.spyOn(retrievePersonalData['httpMethods'], 'unifacePost').mockResolvedValueOnce(httpResponse);

            const result = await retrievePersonalData.retrieve(retrievePersonalDataRequest);

            expect(result).toEqual(httpResponse.data);
            expect(retrievePersonalData['token'].open).toHaveBeenCalledWith(expect.any(String));
            expect(FormatUtils.extractNumbers).toHaveBeenCalledWith(expect.any(String));
            expect(FormatUtils.extractUsername).toHaveBeenCalledWith(payloadTokenResponse.preferred_username);
            expect(UnifaceHelper.unifaceBaseStructHelper).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object),
                expect.any(Object as Header),
                expect.any(String),
            );
            expect(retrievePersonalData['httpMethods'].unifacePost).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Object as unknown as UnifaceBaseStruct),
                expect.any(String),
            );
        });
    });
});
