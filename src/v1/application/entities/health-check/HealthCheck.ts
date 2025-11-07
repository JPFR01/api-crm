import {HealthCheck as _HealthCheck} from '@/v1/domain/entities/health-check/HealthCheck';

export class HealthCheck implements _HealthCheck {
    async check(): Promise<string> {
        return 'Ok';
    }
}
