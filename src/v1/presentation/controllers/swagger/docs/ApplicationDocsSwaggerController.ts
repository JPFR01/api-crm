import {httpResponseHelper} from '@/v1/presentation/helpers/httpResponseHelper';
import {Controller} from '@/v1/presentation/helpers/Controller';
import {HttpResponse} from '@/v1/presentation/protocols/Http';
import {ok} from '@/v1/presentation/helpers/http-helper';
import {Logger} from '@/v1/domain/repository/Logger';

export class ApplicationDocsSwaggerController implements Controller {
    constructor(
        private readonly configSwagger: any,
        private readonly logger: Logger,
    ) {}

    async handle(): Promise<HttpResponse> {
        try {
            await this.logger.info({
                origem: 'v1/swagger.json',
                versao: 'v1',
                destino: 'swagger.json',
                classe: 'ApplicationDocsSwaggerJsonController',
                headerLog: {'device-id': {}},
            });

            return ok(this.configSwagger.configPreview);
        } catch (error) {
            return httpResponseHelper(error, '', 'v1/swagger.json', 'swagger.json', 'ApplicationDocsSwaggerJsonController');
        }
    }
}
