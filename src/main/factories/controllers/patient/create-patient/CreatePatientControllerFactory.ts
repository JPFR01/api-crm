import {CreatePatientFactory} from '@/main/factories/entities/patient/create-patient/CreatePatientFactory';
import {LoggerFactory} from '@/main/factories/repository/logger/LoggerFactory';
import {CreatePatientController} from '@/v1/presentation/controllers/patient/create-patient/CreatePatientController';
import {Controller} from '@/v1/presentation/helpers/Controller';

export const CreatePatientControllerFactory = (): Controller => {
    return new CreatePatientController(CreatePatientFactory(), LoggerFactory());
};
