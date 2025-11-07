import {RetrievePersonalDataFactory} from '@/main/factories/entities/cooperative-member/retrieve-personal-data/RetrievePersonalDataFactory';
import {LoggerFactory} from '@/main/factories/repository/logger/LoggerFactory';
import {RetrievePersonalDataController} from '@/v1/presentation/controllers/cooperative-member/retrieve-personal-data/RetrievePersonalDataController';
import {Controller} from '@/v1/presentation/helpers/Controller';

export const RetrievePersonalDataControllerFactory = (): Controller => {
    return new RetrievePersonalDataController(RetrievePersonalDataFactory(), LoggerFactory());
};
