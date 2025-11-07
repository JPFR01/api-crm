import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import {HealthCheck} from './HealthCheck';

describe('v1 application entitites health-check HealthCheck', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('check()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve retornar "Ok" quando o sistema estiver saudável', async (): Promise<void> => {
            const healthCheck = new HealthCheck();
            expect(healthCheck.check()).resolves.toEqual('Ok');
        });
    });
});
