import {httpResponseHelper} from '@/v1/presentation/helpers/httpResponseHelper';
import {Controller} from '@/v1/presentation/helpers/Controller';
import {HttpRequest, HttpResponse} from '@/v1/presentation/protocols/Http';
import {ok} from '@/v1/presentation/helpers/http-helper';
import {Logger} from '@/v1/domain/repository/Logger';
import {RefreshToken, RefreshTokenData} from '@/v1/domain/entities/authentication/refresh-token/RefreshToken';
import {LoginResponse} from '@/v1/domain/entities/authentication/login/Login';
import {HttpStatusCode} from 'axios';

export class RefreshTokenController implements Controller {
    constructor(
        private readonly refreshToken: RefreshToken,
        private readonly logger: Logger,
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const refreshTokenData: RefreshTokenData = {
            refreshToken: httpRequest.body.refreshToken,
        };

        try {
            await this.logger.info({
                origem: 'Request - v1/refreshToken',
                versao: 'v1',
                destino: 'refreshToken',
                classe: 'RefreshTokenController',
                body: refreshTokenData,
            });

            await this.refreshToken.validate(refreshTokenData);
            const refreshTokenResponse: LoginResponse = await this.refreshToken.refresh(refreshTokenData);

            await this.logger.info({
                origem: 'Response - v1/refreshToken',
                versao: 'v1',
                destino: 'refreshToken',
                classe: 'RefreshTokenController',
                body: refreshTokenData,
                response: refreshTokenResponse,
                status: HttpStatusCode.Ok,
            });

            return ok(refreshTokenResponse);
        } catch (error) {
            return httpResponseHelper(error, refreshTokenData, 'v1/refreshToken', 'refreshToken', 'RefreshTokenController');
        }
    }
}
