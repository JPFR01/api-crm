import {Router} from 'express';
import {adaptRoute} from '@/main/adapter/express/expressRouteAdapter';
import {CreatePatientControllerFactory} from '../factories/controllers/patient/create-patient/CreatePatientControllerFactory';

export default (router: Router): void => {
    router.post('/v1/patients/createPatient', adaptRoute(CreatePatientControllerFactory()));
};
