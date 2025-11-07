import {RefreshTokenFactory} from '@/main/factories/entities/authentication/refresh-token/RefreshTokenFactory';
import {LoggerFactory} from '@/main/factories/repository/logger/LoggerFactory';
import {RefreshTokenController} from '@/v1/presentation/controllers/authentication/refresh-token/RefreshTokenController';
import {Controller} from '@/v1/presentation/helpers/Controller';

export const RefreshTokenControllerFactory = (): Controller => {
    return new RefreshTokenController(RefreshTokenFactory(), LoggerFactory());
};
