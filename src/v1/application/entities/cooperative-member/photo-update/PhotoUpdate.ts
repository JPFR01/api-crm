import {extractNumbers, extractUsername} from '@/v1/application/helpers/FormatUtils';
import {tokenValidationHelper} from '@/v1/application/helpers/TokenHelper';
import {unifaceBaseStructHelper} from '@/v1/application/helpers/UnifaceHelper';
import {PhotoUpdate as _PhotoUpdate, PhotoUpdateData} from '@/v1/domain/entities/cooperative-member/photo-update/PhotoUpdate';
import {HttpMethod} from '@/v1/domain/repository/HttpMethod';
import {PayLoadToken, Token} from '@/v1/domain/repository/token/Token';
import {AuthenticationError, InvalidParamError} from '@/v1/domain/shared/errors';

export class PhotoUpdate implements _PhotoUpdate {
    constructor(
        private readonly token: Token,
        private readonly httpMethods: HttpMethod,
    ) {}

    async validate(data: PhotoUpdateData): Promise<void> {
        if (!data.body.cpfUsuario || extractNumbers(data.body.cpfUsuario).length !== 11)
            throw new InvalidParamError('Method: PhotoUpdate.validate - Param cpfUsuario', 'O Cpf do usuário deve ser informado corretamente !');

        if (!data.body.imagemPerfil)
            throw new InvalidParamError('Method: PhotoUpdate.validate - Param imagemPerfil', 'A imagem de perfil do usuário deve ser informada !');

        tokenValidationHelper(data.header, 'Application PhotoUpdate.validate');

        if ((await this.token.authentication(data.header.authorization.substring(7))) !== 'Active')
            throw new AuthenticationError(
                'Method: PhotoUpdate.validate - expired access token !',
                'Token de acesso expirado, favor realizar o login novamente!',
            );
    }

    async update(data: PhotoUpdateData): Promise<void> {
        const openedToken: PayLoadToken = await this.token.open(data.header.authorization.substring(7));

        await this.httpMethods.unifacePost(
            `${process.env.UNIFACE_URL}/pcopd001`,
            unifaceBaseStructHelper(
                {operationId: 'alterarFoto', version: 'v1'},
                {
                    cpfUsuario: extractNumbers(data.body.cpfUsuario),
                    imagemPerfil: data.body.imagemPerfil,
                },
                data.header,
                extractUsername(openedToken.preferred_username ?? openedToken.email),
            ),
            'PhotoUpdate',
        );
    }
}
