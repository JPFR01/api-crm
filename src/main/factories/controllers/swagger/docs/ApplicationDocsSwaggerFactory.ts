import {Controller} from '@/v1/presentation/helpers/Controller';
import {LoggerFactory} from '@/main/factories/repository/logger/LoggerFactory';
import {ApplicationDocsSwaggerController} from '@/v1/presentation/controllers/swagger/docs/ApplicationDocsSwaggerController';
import {ConfigSwagger} from '@/infrastructure/swagger/configSwagger/ConfigSwagger';

export const ApplicationDocsSwaggerFactory = (): Controller => {
    return new ApplicationDocsSwaggerController(ConfigSwagger, LoggerFactory());
};
