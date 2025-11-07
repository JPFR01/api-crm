import {httpResponseHelper} from '@/v1/presentation/helpers/httpResponseHelper';
import {Controller} from '@/v1/presentation/helpers/Controller';
import {HttpResponse} from '@/v1/presentation/protocols/Http';
import {ok} from '@/v1/presentation/helpers/http-helper';
import {Logger} from '@/v1/domain/repository/Logger';
import {HealthCheck} from '@/v1/domain/entities/health-check/HealthCheck';

export class HealthCheckController implements Controller {
    constructor(
        private readonly healthCheck: HealthCheck,
        private readonly logger: Logger,
    ) {}

    async handle(): Promise<HttpResponse> {
        try {
            await this.logger.info({
                origem: 'v1/health-check',
                versao: 'v1',
                destino: 'health-check',
                classe: 'HealthCheckController',
                headerLog: {'device-id': {}},
            });

            return ok({status: await this.healthCheck.check()});
        } catch (error: unknown) {
            return httpResponseHelper(error, '', 'v1/health-check', 'health-check', 'HealthCheckController');
        }
    }
}
