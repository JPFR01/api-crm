import {extractNumbers, extractUsername} from '@/v1/application/helpers/FormatUtils';
import {tokenValidationHelper} from '@/v1/application/helpers/TokenHelper';
import {unifaceBaseStructHelper} from '@/v1/application/helpers/UnifaceHelper';
import {
    CreatePatient as _CreatePatient,
    CreatePatientRequest,
    CreatePatientResponse,
} from '@/v1/domain/entities/patient/create-patient/CreatePatient';
import {HttpMethod} from '@/v1/domain/repository/HttpMethod';
import {PayLoadToken, Token} from '@/v1/domain/repository/token/Token';
import {AuthenticationError, InvalidParamError} from '@/v1/domain/shared/errors';

export class CreatePatient implements _CreatePatient {
    constructor(
        private readonly token: Token,
        private readonly httpMethods: HttpMethod,
    ) {}

    async validate(data: CreatePatientRequest): Promise<void> {
        if (!data.cpfUsuario || extractNumbers(data.cpfUsuario).length !== 11)
            throw new InvalidParamError('Method: CreatePatient.validate - Param cpfUsuario', 'O Cpf do usuário deve ser informado corretamente !');

        tokenValidationHelper(data.header, 'Application CreatePatient.validate');

        if ((await this.token.authentication(data.header.authorization.substring(7))) !== 'Active')
            throw new AuthenticationError(
                'Method: CreatePatient.validate - Token de acesso expirado !',
                'Token de acesso expirado, favor realizar o login novamente!',
            );
    }

    async retrieve(data: CreatePatientRequest): Promise<CreatePatientResponse> {
        const openedToken: PayLoadToken = await this.token.open(data.header.authorization.substring(7));

        return (
            await this.httpMethods.unifacePost(
                `${process.env.UNIFACE_URL}/pcopd001`,
                unifaceBaseStructHelper(
                    {operationId: 'criarPaciente', version: 'v1'},
                    {cpfUsuario: extractNumbers(data.cpfUsuario)},
                    data.header,
                    extractUsername(openedToken.preferred_username ?? openedToken.email),
                ),
                'CreatePatient',
            )
        ).data;
    }
}
