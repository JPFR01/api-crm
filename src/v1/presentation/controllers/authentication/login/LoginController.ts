import {httpResponseHelper} from '@/v1/presentation/helpers/httpResponseHelper';
import {Controller} from '@/v1/presentation/helpers/Controller';
import {HttpRequest, HttpResponse} from '@/v1/presentation/protocols/Http';
import {ok} from '@/v1/presentation/helpers/http-helper';
import {Logger} from '@/v1/domain/repository/Logger';
import {Login, LoginData, LoginResponse} from '@/v1/domain/entities/authentication/login/Login';
import {HttpStatusCode} from 'axios';

export class LoginController implements Controller {
    constructor(
        private readonly login: Login,
        private readonly logger: Logger,
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const loginData: LoginData = {
            body: httpRequest.body,
        };

        try {
            await this.logger.info({
                origem: 'Request - v1/login',
                versao: 'v1',
                destino: 'login',
                classe: 'LoginController',
                body: loginData,
            });

            await this.login.validate(loginData);
            const LoginResponse: LoginResponse = await this.login.login(loginData);

            await this.logger.info({
                origem: 'Response - v1/login',
                versao: 'v1',
                destino: 'login',
                classe: 'LoginController',
                body: loginData,
                response: LoginResponse,
                status: HttpStatusCode.Ok,
            });

            return ok(LoginResponse);
        } catch (error) {
            return httpResponseHelper(error, loginData, 'v1/login', 'login', 'LoginController');
        }
    }
}
