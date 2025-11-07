"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const FormatUtils = __importStar(require("../../../helpers/FormatUtils"));
const TokenHelper = __importStar(require("../../../helpers/TokenHelper"));
const UnifaceHelper = __importStar(require("../../../helpers/UnifaceHelper"));
const PhotoUpdate_1 = require("./PhotoUpdate");
const errors_1 = require("../../../../../../v1/domain/shared/errors");
const data_mock_1 = require("../../../../../../tests/mocks/data.mock");
(0, globals_1.describe)('v1 application entitites photo-update PhotoUpdate', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    const photoUpdateData = {
        body: {
            cpfUsuario: '123.456.789-01',
            imagemPerfil: 'fake-imagem',
        },
        header: data_mock_1.header,
    };
    (0, globals_1.describe)('validate()', () => {
        let photoUpdate;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const token = {
                authentication: globals_1.jest.fn(),
                open: globals_1.jest.fn(),
            };
            const httpMethods = {
                unifacePost: globals_1.jest.fn(),
            };
            photoUpdate = new PhotoUpdate_1.PhotoUpdate(token, httpMethods);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve ocorrer um erro se dados do cooperado estiverem vazios', async () => {
            const photoUpdateData = {
                body: {
                    cpfUsuario: '',
                    imagemPerfil: 'fake-imagem',
                },
                header: data_mock_1.header,
            };
            (0, globals_1.expect)(photoUpdate.validate(photoUpdateData)).rejects.toThrow(errors_1.InvalidParamError);
        });
        (0, globals_1.it)('deve ocorrer um erro se dados do cooperado estiverem vazios', async () => {
            const photoUpdateData = {
                body: {
                    cpfUsuario: '1.2.3',
                    imagemPerfil: 'fake-imagem',
                },
                header: data_mock_1.header,
            };
            globals_1.jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('123');
            (0, globals_1.expect)(photoUpdate.validate(photoUpdateData)).rejects.toThrow(errors_1.InvalidParamError);
        });
        (0, globals_1.it)('deve ocorrer um erro se dados da foto estiverem vazios', async () => {
            const photoUpdateData = {
                body: {
                    cpfUsuario: '123.456.789-01',
                    imagemPerfil: '',
                },
                header: data_mock_1.header,
            };
            globals_1.jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            (0, globals_1.expect)(photoUpdate.validate(photoUpdateData)).rejects.toThrow(errors_1.InvalidParamError);
        });
        (0, globals_1.it)('deve ocorrer um erro de sessão inválida', async () => {
            globals_1.jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            globals_1.jest.spyOn(TokenHelper, 'tokenValidationHelper').mockReturnValueOnce(null);
            globals_1.jest.spyOn(photoUpdate['token'], 'authentication').mockResolvedValueOnce('Unauthorized');
            (0, globals_1.expect)(photoUpdate.validate(photoUpdateData)).rejects.toThrow(errors_1.AuthenticationError);
        });
        (0, globals_1.it)('deve ocorrer um erro de sessão expirada', async () => {
            globals_1.jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            globals_1.jest.spyOn(TokenHelper, 'tokenValidationHelper').mockReturnValueOnce(null);
            globals_1.jest.spyOn(photoUpdate['token'], 'authentication').mockResolvedValueOnce('Expired');
            (0, globals_1.expect)(photoUpdate.validate(photoUpdateData)).rejects.toThrow(errors_1.AuthenticationError);
        });
        (0, globals_1.it)('deve validar os dados para atualização de foto', async () => {
            globals_1.jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            globals_1.jest.spyOn(TokenHelper, 'tokenValidationHelper').mockReturnValueOnce(null);
            globals_1.jest.spyOn(photoUpdate['token'], 'authentication').mockResolvedValueOnce('Active');
            const result = await photoUpdate.validate(photoUpdateData);
            (0, globals_1.expect)(result).toBeUndefined();
            (0, globals_1.expect)(FormatUtils.extractNumbers).toHaveBeenCalledWith(globals_1.expect.any(String));
            (0, globals_1.expect)(TokenHelper.tokenValidationHelper).toHaveBeenCalledWith(globals_1.expect.any(Object), 'Application PhotoUpdate.validate');
            (0, globals_1.expect)(photoUpdate['token'].authentication).toHaveBeenCalledWith(globals_1.expect.any(String));
        });
    });
    (0, globals_1.describe)('update()', () => {
        let photoUpdate;
        const baseStructUniface = {
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
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const token = {
                authentication: globals_1.jest.fn(),
                open: globals_1.jest.fn(),
            };
            const httpMethods = {
                unifacePost: globals_1.jest.fn(),
            };
            photoUpdate = new PhotoUpdate_1.PhotoUpdate(token, httpMethods);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve atualizar a foto do cooperado com sucesso 01', async () => {
            const payloadTokenResponseSimples = { ...data_mock_1.payloadTokenResponse };
            payloadTokenResponseSimples.preferred_username = undefined;
            globals_1.jest.spyOn(photoUpdate['token'], 'open').mockResolvedValueOnce(payloadTokenResponseSimples);
            globals_1.jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            globals_1.jest.spyOn(FormatUtils, 'extractUsername').mockReturnValueOnce('username');
            globals_1.jest.spyOn(UnifaceHelper, 'unifaceBaseStructHelper').mockReturnValueOnce(baseStructUniface);
            globals_1.jest.spyOn(photoUpdate['httpMethods'], 'unifacePost').mockResolvedValueOnce(null);
            const result = await photoUpdate.update(photoUpdateData);
            (0, globals_1.expect)(result).toBeUndefined();
            (0, globals_1.expect)(photoUpdate['token'].open).toHaveBeenCalledWith(globals_1.expect.any(String));
            (0, globals_1.expect)(FormatUtils.extractNumbers).toHaveBeenCalledWith(globals_1.expect.any(String));
            (0, globals_1.expect)(FormatUtils.extractUsername).toHaveBeenCalledWith(payloadTokenResponseSimples.email);
            (0, globals_1.expect)(UnifaceHelper.unifaceBaseStructHelper).toHaveBeenCalledWith(globals_1.expect.any(Object), globals_1.expect.any(Object), globals_1.expect.any(Object), globals_1.expect.any(String));
            (0, globals_1.expect)(photoUpdate['httpMethods'].unifacePost).toHaveBeenCalledWith(globals_1.expect.any(String), globals_1.expect.any(Object), globals_1.expect.any(String));
        });
        (0, globals_1.it)('deve atualizar a foto do cooperado com sucesso 02', async () => {
            globals_1.jest.spyOn(photoUpdate['token'], 'open').mockResolvedValueOnce(data_mock_1.payloadTokenResponse);
            globals_1.jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValueOnce('12345678901');
            globals_1.jest.spyOn(FormatUtils, 'extractUsername').mockReturnValueOnce('username');
            globals_1.jest.spyOn(UnifaceHelper, 'unifaceBaseStructHelper').mockReturnValueOnce(baseStructUniface);
            globals_1.jest.spyOn(photoUpdate['httpMethods'], 'unifacePost').mockResolvedValueOnce(null);
            const result = await photoUpdate.update(photoUpdateData);
            (0, globals_1.expect)(result).toBeUndefined();
            (0, globals_1.expect)(photoUpdate['token'].open).toHaveBeenCalledWith(globals_1.expect.any(String));
            (0, globals_1.expect)(FormatUtils.extractNumbers).toHaveBeenCalledWith(globals_1.expect.any(String));
            (0, globals_1.expect)(FormatUtils.extractUsername).toHaveBeenCalledWith(data_mock_1.payloadTokenResponse.preferred_username);
            (0, globals_1.expect)(UnifaceHelper.unifaceBaseStructHelper).toHaveBeenCalledWith(globals_1.expect.any(Object), globals_1.expect.any(Object), globals_1.expect.any(Object), globals_1.expect.any(String));
            (0, globals_1.expect)(photoUpdate['httpMethods'].unifacePost).toHaveBeenCalledWith(globals_1.expect.any(String), globals_1.expect.any(Object), globals_1.expect.any(String));
        });
    });
});
