import {Controller} from '@/v1/presentation/helpers/Controller';
import {LoggerFactory} from '@/main/factories/repository/logger/LoggerFactory';
import {LoginFactory} from '@/main/factories/entities/authentication/login/LoginFactory';
import {LoginController} from '@/v1/presentation/controllers/authentication/login/LoginController';

export const LoginControllerFactory = (): Controller => {
    return new LoginController(LoginFactory(), LoggerFactory());
};
