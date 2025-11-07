import {HealthCheck} from '@/v1/application/entities/health-check/HealthCheck';

export const HealthCheckFactory = (): HealthCheck => {
    return new HealthCheck();
};
