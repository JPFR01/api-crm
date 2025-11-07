import {Header} from '@/infrastructure/helpers/HeaderHelper';

export interface CreatePatientRequest {
    cpfUsuario: string;
    header: Header;
}

export interface CreatePatientResponse {
    codigoMatricula: number;
    cpfUsuario: string;
    nomeUsuario: string;
    fotoUsuario: string;
    codigoLocalAcerto: number;
    nomeLocalAcerto: string;
    dataAdmissao: Date;
}

export interface CreatePatient {
    validate: (data: CreatePatientRequest) => Promise<void>;
    retrieve: (data: CreatePatientRequest) => Promise<CreatePatientResponse>;
}
