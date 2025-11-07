import {extractNumbers, extractUsername} from '@/v1/application/helpers/FormatUtils';
import {tokenValidationHelper} from '@/v1/application/helpers/TokenHelper';
import {unifaceBaseStructHelper} from '@/v1/application/helpers/UnifaceHelper';
import {
    RetrievePersonalData as _RetrievePersonalData,
    RetrievePersonalDataRequest,
    RetrievePersonalDataResponse,
} from '@/v1/domain/entities/cooperative-member/retrieve-personal-data/RetrievePersonalData';
import {HttpMethod} from '@/v1/domain/repository/HttpMethod';
import {PayLoadToken, Token} from '@/v1/domain/repository/token/Token';
import {AuthenticationError, InvalidParamError} from '@/v1/domain/shared/errors';

export class RetrievePersonalData implements _RetrievePersonalData {
    constructor(
        private readonly token: Token,
        private readonly httpMethods: HttpMethod,
    ) {}

    async validate(data: RetrievePersonalDataRequest): Promise<void> {
        if (!data.cpfUsuario || extractNumbers(data.cpfUsuario).length !== 11)
            throw new InvalidParamError(
                'Method: RetrievePersonalData.validate - Param cpfUsuario',
                'O Cpf do usuário deve ser informado corretamente !',
            );

        tokenValidationHelper(data.header, 'Application RetrievePersonalData.validate');

        if ((await this.token.authentication(data.header.authorization.substring(7))) !== 'Active')
            throw new AuthenticationError(
                'Method: RetrievePersonalData.validate - Token de acesso expirado !',
                'Token de acesso expirado, favor realizar o login novamente!',
            );
    }

    async retrieve(data: RetrievePersonalDataRequest): Promise<RetrievePersonalDataResponse> {
        const openedToken: PayLoadToken = await this.token.open(data.header.authorization.substring(7));

        return (
            await this.httpMethods.unifacePost(
                `${process.env.UNIFACE_URL}/pcopd001`,
                unifaceBaseStructHelper(
                    {operationId: 'recuperarDadosPessoais', version: 'v1'},
                    {cpfUsuario: extractNumbers(data.cpfUsuario)},
                    data.header,
                    extractUsername(openedToken.preferred_username ?? openedToken.email),
                ),
                'RetrievePersonalData',
            )
        ).data;
    }
}
