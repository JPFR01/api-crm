import {Header} from '@/infrastructure/helpers/HeaderHelper';

export interface RetrievePersonalDataRequest {
    cpfUsuario: string;
    header: Header;
}

export interface RetrievePersonalDataResponse {
    codigoMatricula: number;
    cpfUsuario: string;
    nomeUsuario: string;
    fotoUsuario: string;
    codigoLocalAcerto: number;
    nomeLocalAcerto: string;
    dataAdmissao: Date;
}

export interface RetrievePersonalData {
    validate: (data: RetrievePersonalDataRequest) => Promise<void>;
    retrieve: (data: RetrievePersonalDataRequest) => Promise<RetrievePersonalDataResponse>;
}
