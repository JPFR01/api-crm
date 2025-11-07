import {maskFieldsHelper, maskXmlFieldsHelper} from '@/infrastructure/helpers/LoggerHelper';
import {filterNullUndefinedAttributes} from '@/v1/application/helpers/UnifaceHelper';
import {Logger as ILogger, LoggerLevel, LoggerLogData} from '@/v1/domain/repository/Logger';
import * as winston from 'winston';
import {AzureApplicationInsightsLogger} from 'winston-azure-application-insights';

const {combine, timestamp, prettyPrint} = winston.format;

export class Logger implements ILogger {
    private readonly logger: winston.Logger;

    constructor() {
        const transports: winston.transport[] = [];

        if (process.env.NODE_ENV === 'development') {
            transports.push(new winston.transports.Console());
        }

        if (process.env.APPINSIGHTS_CONNECTION_STRING) {
            transports.push(
                new AzureApplicationInsightsLogger({
                    instrumentationKey: process.env.APPINSIGHTS_CONNECTION_STRING,
                }),
            );
        }

        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: combine(timestamp(), prettyPrint()),
            transports,
        });
    }

    async log(data: LoggerLogData, level: LoggerLevel): Promise<void> {
        this.logger.log(
            level,
            filterNullUndefinedAttributes({
                tipo: data.tipo,
                origem: data.origem,
                versao: data.versao,
                destino: data.destino,
                classe: data.classe,
                headerLog: data.headerLog,
                body: maskFieldsHelper(data.body),
                requestParam: maskFieldsHelper(data.requestParam),
                pathVariable: data.pathVariable,
                erro: maskFieldsHelper(data.erro),
                payload: maskXmlFieldsHelper(data.payload),
                response: maskFieldsHelper(data.response),
                status: data.status,
            }),
        );
    }

    async info(data: LoggerLogData): Promise<void> {
        await this.log(data, 'info');
    }

    async warn(data: LoggerLogData): Promise<void> {
        await this.log(data, 'warn');
    }

    async error(data: LoggerLogData): Promise<void> {
        await this.log(data, 'error');
    }

    async debug(data: LoggerLogData): Promise<void> {
        await this.log(data, 'debug');
    }
}
