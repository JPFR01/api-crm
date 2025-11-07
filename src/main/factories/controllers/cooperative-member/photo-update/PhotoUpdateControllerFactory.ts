import {PhotoUpdateDataFactory} from '@/main/factories/entities/cooperative-member/photo-update/PhotoUpdateFactory';
import {LoggerFactory} from '@/main/factories/repository/logger/LoggerFactory';
import {PhotoUpdateController} from '@/v1/presentation/controllers/cooperative-member/photo-update/PhotoUpdate';
import {Controller} from '@/v1/presentation/helpers/Controller';

export const PhotoUpdateControllerFactory = (): Controller => {
    return new PhotoUpdateController(PhotoUpdateDataFactory(), LoggerFactory());
};
