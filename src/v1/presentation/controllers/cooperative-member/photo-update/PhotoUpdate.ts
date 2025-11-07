import {httpResponseHelper} from '@/v1/presentation/helpers/httpResponseHelper';
import {Controller} from '@/v1/presentation/helpers/Controller';
import {HttpRequest, HttpResponse} from '@/v1/presentation/protocols/Http';
import {noContent} from '@/v1/presentation/helpers/http-helper';
import {Logger} from '@/v1/domain/repository/Logger';
import {PhotoUpdate, PhotoUpdateData} from '@/v1/domain/entities/cooperative-member/photo-update/PhotoUpdate';
import {HttpStatusCode} from 'axios';

export class PhotoUpdateController implements Controller {
    constructor(
        private readonly photoUpdate: PhotoUpdate,
        private readonly logger: Logger,
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const photoUpdateData: PhotoUpdateData = {
            body: httpRequest.body,
            header: httpRequest.headers,
        };

        try {
            await this.logger.info({
                origem: 'Request - v1/usuarios/alterarFoto',
                versao: 'v1',
                destino: 'alterarFoto',
                classe: 'PhotoUpdateController',
                headerLog: {'device-id': photoUpdateData.header['device-id']},
                body: photoUpdateData,
            });

            await this.photoUpdate.validate(photoUpdateData);
            await this.photoUpdate.update(photoUpdateData);

            await this.logger.info({
                origem: 'Response - v1/usuarios/alterarFoto',
                versao: 'v1',
                destino: 'alterarFoto',
                classe: 'PhotoUpdateController',
                headerLog: {'device-id': photoUpdateData.header['device-id']},
                body: photoUpdateData,
                response: {},
                status: HttpStatusCode.NoContent,
            });

            return noContent();
        } catch (error) {
            return httpResponseHelper(error, photoUpdateData, 'v1/usuarios/alterarFoto', 'alterarFoto', 'PhotoUpdateController');
        }
    }
}
