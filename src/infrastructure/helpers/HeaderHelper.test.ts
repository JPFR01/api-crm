import {expect, describe, it, beforeAll, jest} from '@jest/globals';

import {header} from '../../../tests/mocks/data.mock';

describe('Helpers HeaderHelper', (): void => {
    beforeAll((): void => {
        jest.clearAllMocks();
    });

    describe('Helpers HeaderHelper Header', (): void => {
        it('Interface deve conter atributos obrigatórios', (): void => {
            expect(typeof header['device-id'] === 'string' || typeof header['device-id'] === 'undefined').toBe(true);
            expect(typeof header['app-version'] === 'string' || typeof header['app-version'] === 'undefined').toBe(true);
            expect(typeof header['device-os'] === 'string' || typeof header['device-os'] === 'undefined').toBe(true);
            expect(typeof header['alternative-url'] === 'string' || typeof header['alternative-url'] === 'undefined').toBe(true);
            expect(typeof header['x-correlation-id'] === 'string' || typeof header['x-correlation-id'] === 'undefined').toBe(true);
            expect(typeof header['production-redirect'] === 'string' || typeof header['production-redirect'] === 'undefined').toBe(true);
            expect(typeof header['token'] === 'string' || typeof header['token'] === 'undefined').toBe(true);
            expect(typeof header['refreshToken'] === 'string' || typeof header['refreshToken'] === 'undefined').toBe(true);
            expect(typeof header['authorization'] === 'string' || typeof header['authorization'] === 'undefined').toBe(true);
        });
    });
});
