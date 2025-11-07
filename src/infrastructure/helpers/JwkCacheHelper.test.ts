import {expect, describe, it, jest, beforeEach} from '@jest/globals';

import {JwkKey} from '@/v1/domain/repository/keycloak/Keycloak';

import {JwkCache} from './JwkCacheHelper';

const setMock = jest.spyOn(JwkCache, 'set');
const clearMock = jest.spyOn(JwkCache, 'clear');

describe('helpers JwkCacheHelper', (): void => {
    const mockKeys: JwkKey[] = [
        {
            kid: 'mockString',
            kty: 'mockString',
            alg: 'mockString',
            use: 'mockString',
            n: 'mockString',
            e: 'mockString',
        },
    ];

    beforeEach((): void => {
        jest.clearAllMocks();
    });

    describe('helpers JwkCacheHelper get', (): void => {
        beforeEach((): void => {
            JwkCache.set(mockKeys);
        });

        it('Deve retornar as chaves do cache', (): void => {
            jest.spyOn(JwkCache, 'isExpired').mockReturnValueOnce(false);

            expect(JwkCache.get()).toEqual(mockKeys);

            expect(clearMock).not.toHaveBeenCalled();
            expect(JwkCache['keys']).toEqual(mockKeys);
        });

        it('Deve retornar as chaves vazias', (): void => {
            jest.spyOn(JwkCache, 'isExpired').mockReturnValueOnce(true);

            expect(JwkCache.get()).toEqual(null);

            expect(JwkCache.isExpired).toHaveBeenCalled();
            expect(clearMock).toHaveBeenCalled();
            expect(JwkCache['keys']).toEqual(null);
            expect(JwkCache['lastFetch']).toEqual(0);
        });
    });

    describe('helpers JwkCacheHelper set', (): void => {
        it('Deve definir o cache', (): void => {
            jest.spyOn(Date, 'now').mockReturnValueOnce(1755869066259);
            JwkCache.set(mockKeys);

            for (const key of mockKeys) {
                expect(typeof key.kid).toBe('string');
                expect(typeof key.kty).toBe('string');
                expect(typeof key.alg).toBe('string');
                expect(typeof key.use).toBe('string');
                expect(typeof key.n === 'string' || typeof key.n === 'undefined').toBe(true);
                expect(typeof key.e === 'string' || typeof key.e === 'undefined').toBe(true);
                expect(typeof key.x5c === 'string' || typeof key.x5c === 'undefined').toBe(true);
                expect(typeof key.x5t === 'string' || typeof key.x5t === 'undefined').toBe(true);
            }

            expect(setMock).toHaveBeenCalledWith(mockKeys);
            expect(JwkCache['keys']).toEqual(mockKeys);
            expect(JwkCache['lastFetch']).toEqual(1755869066259);
        });
    });

    describe('helpers JwkCacheHelper clear', (): void => {
        it('Deve limpar o cache', (): void => {
            JwkCache.set(mockKeys);
            JwkCache.clear();

            expect(clearMock).toHaveBeenCalled();
            expect(JwkCache['keys']).toEqual(null);
            expect(JwkCache['lastFetch']).toEqual(0);
        });
    });

    describe('helpers JwkCacheHelper isExpired', (): void => {
        it('Deve retornar true se cache estiver expirado', (): void => {
            jest.spyOn(Date, 'now').mockReturnValueOnce(JwkCache['lastFetch'] + JwkCache['ttl'] + 1);

            expect(JwkCache.isExpired()).toBe(true);
        });

        it('Deve retornar false se cache não estiver expirado', (): void => {
            jest.spyOn(Date, 'now').mockReturnValueOnce(JwkCache['lastFetch'] + JwkCache['ttl'] - 1);

            expect(JwkCache.isExpired()).toBe(false);
        });
    });
});
