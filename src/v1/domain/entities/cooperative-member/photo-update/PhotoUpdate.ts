import {Header} from '@/infrastructure/helpers/HeaderHelper';

export interface PhotoUpdateData {
    body: PhotoUpdateBody;
    header: Header;
}

export interface PhotoUpdateBody {
    cpfUsuario: string;
    imagemPerfil: string;
}

export interface PhotoUpdate {
    validate: (data: PhotoUpdateData) => Promise<void>;
    update: (data: PhotoUpdateData) => Promise<void>;
}
