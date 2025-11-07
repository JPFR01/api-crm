import {httpResponseHelper} from '@/v1/presentation/helpers/httpResponseHelper';
import {Controller} from '@/v1/presentation/helpers/Controller';
import {HttpRequest, HttpResponse} from '@/v1/presentation/protocols/Http';
import {ok} from '@/v1/presentation/helpers/http-helper';
import {Logger} from '@/v1/domain/repository/Logger';
import {CreatePatient, CreatePatientRequest, CreatePatientResponse} from '@/v1/domain/entities/patient/create-patient/CreatePatient';
import {HttpStatusCode} from 'axios';

export class CreatePatientController implements Controller {
    constructor(
        private readonly personalData: CreatePatient,
        private readonly logger: Logger,
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const personalDataRequest: CreatePatientRequest = {
            cpfUsuario: httpRequest.body.cpfUsuario,
            header: httpRequest.headers,
        };

        try {
            await this.logger.info({
                origem: 'v1/usuarios/recuperarDadosPessoais',
                versao: 'v1',
                destino: 'recuperarDadosPessoais',
                classe: 'CreatePatientController',
                headerLog: {'device-id': personalDataRequest.header['device-id']},
                body: personalDataRequest,
            });

            await this.personalData.validate(personalDataRequest);
            const personalDataResponse: CreatePatientResponse = await this.personalData.retrieve(personalDataRequest);

            await this.logger.info({
                origem: 'Response - v1/usuarios/recuperarDadosPessoais',
                versao: 'v1',
                destino: 'recuperarDadosPessoais',
                classe: 'CreatePatientController',
                body: personalDataRequest,
                response: personalDataResponse,
                status: HttpStatusCode.Ok,
            });

            return ok(personalDataResponse);
        } catch (error) {
            return httpResponseHelper(
                error,
                personalDataRequest,
                'v1/usuarios/recuperarDadosPessoais',
                'recuperarDadosPessoais',
                'CreatePatientController',
            );
        }
    }
}
