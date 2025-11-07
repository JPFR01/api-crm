import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import * as FormatUtils from '../../../helpers/FormatUtils';
import * as TokenHelper from '../../../helpers/TokenHelper';
import * as UnifaceHelper from '../../../helpers/UnifaceHelper';

import {HttpMethod, UnifaceBaseStruct} from '@/v1/domain/repository/HttpMethod';
import {Token} from '@/v1/domain/repository/token/Token';

import {PhotoUpdate} from './PhotoUpdate';
import {PhotoUpdateData} from '@/v1/domain/entities/cooperative-member/photo-update/PhotoUpdate';
import {Header} from '@/infrastructure/helpers/HeaderHelper';
import {AuthenticationError, InvalidParamError} from '@/v1/domain/shared/errors';
import {header, payloadTokenResponse} from '../../../../../../tests/mocks/data.mock';

describe('v1 application entitites photo-update PhotoUpdate', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    const photoUpdateData: PhotoUpdateData = {
        body: {
            cpfUsuario: '123.456.789-01',
            imagemPerfil: 'fake-imagem',
        },
        header: header,
    };

    describe('validate()', (): void => {
        let photoUpdate: PhotoUpdate;

        beforeEach((): void => {
            jest.clearAllMocks();
            const token: Token = {
                authentication: jest.fn(),
                open: jest.fn(),
            } as unknown as Token;
            const httpMethods: HttpMethod = {
                unifacePost: jest.fn(),
            } as unknown as HttpMethod;
            photoUpdate = new PhotoUpdate(token, httpMethods);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve ocorrer um erro se dados do cooperado estiverem vazios', async (): Promise<void> => {
            const photoUpdateData: PhotoUpdateData = {
                body: {
                    cpfUsuario: '',
                    imagemPerfil: 'fake-imagem',
                },
                header: header,
            };

            expect(photoUpdate.validate(photoUpdateData)).rejects.toThrow(InvalidParamError);
        });

        it('deve ocorrer um erro se dados do cooperado estiverem vazios', async (): Promise<void> => {
            const photoUpdateData: PhotoUpdateData = {
                body: {
                    cpfUsuario: '1.2.3',
                    imagemPerfil: 'fake-imagem',
                },
                header: header,
            };
            jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('123');

            expect(photoUpdate.validate(photoUpdateData)).rejects.toThrow(InvalidParamError);
        });

        it('deve ocorrer um erro se dados da foto estiverem vazios', async (): Promise<void> => {
            const photoUpdateData: PhotoUpdateData = {
                body: {
                    cpfUsuario: '123.456.789-01',
                    imagemPerfil: '',
                },
                header: header,
            };
            jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');

            expect(photoUpdate.validate(photoUpdateData)).rejects.toThrow(InvalidParamError);
        });

        it('deve ocorrer um erro de sessão inválida', async (): Promise<void> => {
            jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            jest.spyOn(TokenHelper, 'tokenValidationHelper').mockReturnValueOnce(null);
            jest.spyOn(photoUpdate['token'], 'authentication').mockResolvedValueOnce('Unauthorized');

            expect(photoUpdate.validate(photoUpdateData)).rejects.toThrow(AuthenticationError);
        });

        it('deve ocorrer um erro de sessão expirada', async (): Promise<void> => {
            jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            jest.spyOn(TokenHelper, 'tokenValidationHelper').mockReturnValueOnce(null);
            jest.spyOn(photoUpdate['token'], 'authentication').mockResolvedValueOnce('Expired');

            expect(photoUpdate.validate(photoUpdateData)).rejects.toThrow(AuthenticationError);
        });

        it('deve validar os dados para atualização de foto', async (): Promise<void> => {
            jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            jest.spyOn(TokenHelper, 'tokenValidationHelper').mockReturnValueOnce(null);
            jest.spyOn(photoUpdate['token'], 'authentication').mockResolvedValueOnce('Active');

            const result = await photoUpdate.validate(photoUpdateData);

            expect(result).toBeUndefined();
            expect(FormatUtils.extractNumbers).toHaveBeenCalledWith(expect.any(String));
            expect(TokenHelper.tokenValidationHelper).toHaveBeenCalledWith(expect.any(Object as Header), 'Application PhotoUpdate.validate');
            expect(photoUpdate['token'].authentication).toHaveBeenCalledWith(expect.any(String));
        });
    });

    describe('update()', (): void => {
        let photoUpdate: PhotoUpdate;

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
            photoUpdate = new PhotoUpdate(token, httpMethods);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve atualizar a foto do cooperado com sucesso 01', async (): Promise<void> => {
            const payloadTokenResponseSimples = {...payloadTokenResponse};
            payloadTokenResponseSimples.preferred_username = undefined;

            jest.spyOn(photoUpdate['token'], 'open').mockResolvedValueOnce(payloadTokenResponseSimples);
            jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            jest.spyOn(FormatUtils, 'extractUsername').mockReturnValueOnce('username');
            jest.spyOn(UnifaceHelper, 'unifaceBaseStructHelper').mockReturnValueOnce(baseStructUniface);
            jest.spyOn(photoUpdate['httpMethods'], 'unifacePost').mockResolvedValueOnce(null);

            const result = await photoUpdate.update(photoUpdateData);

            expect(result).toBeUndefined();
            expect(photoUpdate['token'].open).toHaveBeenCalledWith(expect.any(String));
            expect(FormatUtils.extractNumbers).toHaveBeenCalledWith(expect.any(String));
            expect(FormatUtils.extractUsername).toHaveBeenCalledWith(payloadTokenResponseSimples.email);
            expect(UnifaceHelper.unifaceBaseStructHelper).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object),
                expect.any(Object as Header),
                expect.any(String),
            );
            expect(photoUpdate['httpMethods'].unifacePost).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Object as unknown as UnifaceBaseStruct),
                expect.any(String),
            );
        });

        it('deve atualizar a foto do cooperado com sucesso 02', async (): Promise<void> => {
            jest.spyOn(photoUpdate['token'], 'open').mockResolvedValueOnce(payloadTokenResponse);
            jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            jest.spyOn(FormatUtils, 'extractUsername').mockReturnValueOnce('username');
            jest.spyOn(UnifaceHelper, 'unifaceBaseStructHelper').mockReturnValueOnce(baseStructUniface);
            jest.spyOn(photoUpdate['httpMethods'], 'unifacePost').mockResolvedValueOnce(null);

            const result = await photoUpdate.update(photoUpdateData);

            expect(result).toBeUndefined();
            expect(photoUpdate['token'].open).toHaveBeenCalledWith(expect.any(String));
            expect(FormatUtils.extractNumbers).toHaveBeenCalledWith(expect.any(String));
            expect(FormatUtils.extractUsername).toHaveBeenCalledWith(payloadTokenResponse.preferred_username);
            expect(UnifaceHelper.unifaceBaseStructHelper).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object),
                expect.any(Object as Header),
                expect.any(String),
            );
            expect(photoUpdate['httpMethods'].unifacePost).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Object as unknown as UnifaceBaseStruct),
                expect.any(String),
            );
        });
    });
});
