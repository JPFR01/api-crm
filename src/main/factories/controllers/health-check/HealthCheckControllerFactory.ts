import {Controller} from '@/v1/presentation/helpers/Controller';
import {LoggerFactory} from '@/main/factories/repository/logger/LoggerFactory';
import {HealthCheckController} from '@/v1/presentation/controllers/health-check/ApplicationHealthController';
import {HealthCheckFactory} from '@/main/factories/entities/health-check/HealthCheckFactory';

export const HealthCheckControllerFactory = (): Controller => {
    return new HealthCheckController(HealthCheckFactory(), LoggerFactory());
};
