import {HttpMethodFactory} from '@/main/factories/repository/http-methods/HttpMethodFactory';
import {TokenFactory} from '@/main/factories/repository/token/TokenFactory';
import {PhotoUpdate} from '@/v1/application/entities/cooperative-member/photo-update/PhotoUpdate';
import {PhotoUpdate as _PhotoUpdate} from '@/v1/domain/entities/cooperative-member/photo-update/PhotoUpdate';

export const PhotoUpdateDataFactory = (): _PhotoUpdate => {
    return new PhotoUpdate(TokenFactory(), HttpMethodFactory());
};
