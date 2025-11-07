import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';
import {HttpStatusCode} from 'axios';

import {Logger} from './Logger';
import * as winston from 'winston';

import * as LoggerHelper from '../../helpers/LoggerHelper';
import * as UnifaceHelper from '../../../v1/application/helpers/UnifaceHelper';

import * as AzureApplicationModule from 'winston-azure-application-insights';
import {AzureApplicationInsightsLogger} from 'winston-azure-application-insights';
import {LoggerLogData} from '@/v1/domain/repository/Logger';
import {JSONObject} from '@/v1/domain/shared/types/jsonTypes';

jest.mock('winston-azure-application-insights', () => ({
    AzureApplicationInsightsLogger: jest.fn().mockImplementation(() => ({
        log: jest.fn(),
    })),
}));

jest.mock('winston', () => {
    return {
        createLogger: jest.fn(() => ({
            log: jest.fn(),
        })),
        format: {
            timestamp: jest.fn(() => null),
            prettyPrint: jest.fn(() => null),
            combine: jest.fn(() => null),
        },
        Logger: jest.fn(() => ({
            log: jest.fn(),
        })),
        transports: {
            Console: jest.fn(),
        },
    };
});

describe('logger Logger', (): void => {
    const oldEnv: NodeJS.ProcessEnv = process.env;
    let logger: Logger;
    const jsonSensivel: JSONObject = {
        atributo: 'fake-info',
        atributoSensivel: '*',
    };
    const xmlSensivel = '<xml>*</xml>';
    const logData: LoggerLogData = {
        tipo: 'info',
        origem: 'test',
        versao: 'v1',
        destino: 'test',
        classe: 'test',
        headerLog: 'test',
        body: jsonSensivel,
        requestParam: jsonSensivel,
        pathVariable: 'test',
        erro: jsonSensivel,
        payload: xmlSensivel,
        response: jsonSensivel,
        status: HttpStatusCode.Ok,
    };

    beforeEach((): void => {
        jest.clearAllMocks();
        process.env.NODE_ENV = 'development';
        process.env.APPINSIGHTS_CONNECTION_STRING = 'fake-connection-string';
        process.env.LOG_LEVEL = 'fake-log-level';
    });

    afterAll((): void => {
        jest.clearAllMocks();
        process.env = oldEnv;
    });

    describe('constructor()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
            jest.spyOn(winston['format'], 'timestamp').mockReturnValueOnce(null);
            jest.spyOn(winston['format'], 'prettyPrint').mockReturnValueOnce(null);
            jest.spyOn(winston['format'], 'combine').mockReturnValueOnce(null);
        });

        it('deve criar um logger se ambiente for development e APPINSIGHTS_CONNECTION_STRING estiver definido', () => {
            jest.spyOn(winston['transports'], 'Console').mockReturnValueOnce(new winston.transports.Console());
            jest.spyOn(AzureApplicationModule, 'AzureApplicationInsightsLogger').mockReturnValueOnce(
                new AzureApplicationInsightsLogger({instrumentationKey: process.env.APPINSIGHTS_CONNECTION_STRING}),
            );
            jest.spyOn(winston, 'createLogger').mockReturnValueOnce(new winston.Logger());

            logger = new Logger();
            expect(logger).toBeInstanceOf(Logger);
        });

        it('deve criar um logger se APPINSIGHTS_CONNECTION_STRING estiver indefinido', () => {
            process.env.NODE_ENV = 'production';
            process.env.APPINSIGHTS_CONNECTION_STRING = '';

            jest.spyOn(winston, 'createLogger').mockReturnValue(new winston.Logger());

            logger = new Logger();
            expect(logger).toBeInstanceOf(Logger);
        });

        it('deve criar um logger se LOG_LEVEL estiver indefinido', () => {
            process.env.NODE_ENV = 'production';
            process.env.APPINSIGHTS_CONNECTION_STRING = '';
            process.env.LOG_LEVEL = '';

            jest.spyOn(winston, 'createLogger').mockReturnValue(new winston.Logger());

            logger = new Logger();

            expect(logger).toBeInstanceOf(Logger);
        });
    });

    describe('log()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
            jest.spyOn(AzureApplicationModule, 'AzureApplicationInsightsLogger').mockReturnValueOnce(
                new AzureApplicationInsightsLogger({instrumentationKey: process.env.APPINSIGHTS_CONNECTION_STRING}),
            );
        });

        it('deve registrar corretamente uma mensagem de log do tipo info', async () => {
            jest.spyOn(LoggerHelper, 'maskFieldsHelper').mockReturnValue(jsonSensivel);
            jest.spyOn(LoggerHelper, 'maskXmlFieldsHelper').mockReturnValue(xmlSensivel);
            jest.spyOn(UnifaceHelper, 'filterNullUndefinedAttributes').mockReturnValue(logData);
            jest.spyOn(logger['logger'], 'log').mockReturnValueOnce(null);

            const result = logger.log(logData, 'info');

            expect(logger['logger'].log).toHaveBeenCalledWith('info', expect.any(Object));
            expect(LoggerHelper.maskFieldsHelper).toHaveBeenCalledTimes(4);
            expect(LoggerHelper.maskXmlFieldsHelper).toHaveBeenCalledTimes(1);
            expect(result).resolves.toBeUndefined();
        });
    });

    describe('info()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it('deve chamar log com o nível de log "info"', (): void => {
            jest.spyOn(logger, 'log').mockResolvedValueOnce(null);

            logger.info(logData);

            expect(logger.log).toHaveBeenCalledWith(logData, 'info');
        });
    });

    describe('warn()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it('deve chamar log com o nível de log "warn"', (): void => {
            jest.spyOn(logger, 'log').mockResolvedValueOnce(null);

            logger.warn(logData);

            expect(logger.log).toHaveBeenCalledWith(logData, 'warn');
        });
    });

    describe('error()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it('deve chamar log com o nível de log "error"', (): void => {
            jest.spyOn(logger, 'log').mockResolvedValueOnce(null);

            logger.error(logData);

            expect(logger.log).toHaveBeenCalledWith(logData, 'error');
        });
    });

    describe('debug()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it('deve chamar log com o nível de log "debug"', (): void => {
            jest.spyOn(logger, 'log').mockResolvedValueOnce(null);

            logger.debug(logData);

            expect(logger.log).toHaveBeenCalledWith(logData, 'debug');
        });
    });
});
