import {HttpMethodFactory} from '@/main/factories/repository/http-methods/HttpMethodFactory';
import {TokenFactory} from '@/main/factories/repository/token/TokenFactory';
import {RetrievePersonalData} from '@/v1/application/entities/cooperative-member/retrieve-personal-data/RetrievePersonalData';
import {RetrievePersonalData as _RetrievePersonalData} from '@/v1/domain/entities/cooperative-member/retrieve-personal-data/RetrievePersonalData';

export const RetrievePersonalDataFactory = (): _RetrievePersonalData => {
    return new RetrievePersonalData(TokenFactory(), HttpMethodFactory());
};
