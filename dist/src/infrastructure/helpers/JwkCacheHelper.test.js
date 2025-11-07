"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const JwkCacheHelper_1 = require("./JwkCacheHelper");
const setMock = globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'set');
const clearMock = globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'clear');
(0, globals_1.describe)('helpers JwkCacheHelper', () => {
    const mockKeys = [
        {
            kid: 'mockString',
            kty: 'mockString',
            alg: 'mockString',
            use: 'mockString',
            n: 'mockString',
            e: 'mockString',
        },
    ];
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('helpers JwkCacheHelper get', () => {
        (0, globals_1.beforeEach)(() => {
            JwkCacheHelper_1.JwkCache.set(mockKeys);
        });
        (0, globals_1.it)('Deve retornar as chaves do cache', () => {
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'isExpired').mockReturnValueOnce(false);
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache.get()).toEqual(mockKeys);
            (0, globals_1.expect)(clearMock).not.toHaveBeenCalled();
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache['keys']).toEqual(mockKeys);
        });
        (0, globals_1.it)('Deve retornar as chaves vazias', () => {
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'isExpired').mockReturnValueOnce(true);
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache.get()).toEqual(null);
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache.isExpired).toHaveBeenCalled();
            (0, globals_1.expect)(clearMock).toHaveBeenCalled();
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache['keys']).toEqual(null);
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache['lastFetch']).toEqual(0);
        });
    });
    (0, globals_1.describe)('helpers JwkCacheHelper set', () => {
        (0, globals_1.it)('Deve definir o cache', () => {
            globals_1.jest.spyOn(Date, 'now').mockReturnValueOnce(1755869066259);
            JwkCacheHelper_1.JwkCache.set(mockKeys);
            for (const key of mockKeys) {
                (0, globals_1.expect)(typeof key.kid).toBe('string');
                (0, globals_1.expect)(typeof key.kty).toBe('string');
                (0, globals_1.expect)(typeof key.alg).toBe('string');
                (0, globals_1.expect)(typeof key.use).toBe('string');
                (0, globals_1.expect)(typeof key.n === 'string' || typeof key.n === 'undefined').toBe(true);
                (0, globals_1.expect)(typeof key.e === 'string' || typeof key.e === 'undefined').toBe(true);
                (0, globals_1.expect)(typeof key.x5c === 'string' || typeof key.x5c === 'undefined').toBe(true);
                (0, globals_1.expect)(typeof key.x5t === 'string' || typeof key.x5t === 'undefined').toBe(true);
            }
            (0, globals_1.expect)(setMock).toHaveBeenCalledWith(mockKeys);
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache['keys']).toEqual(mockKeys);
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache['lastFetch']).toEqual(1755869066259);
        });
    });
    (0, globals_1.describe)('helpers JwkCacheHelper clear', () => {
        (0, globals_1.it)('Deve limpar o cache', () => {
            JwkCacheHelper_1.JwkCache.set(mockKeys);
            JwkCacheHelper_1.JwkCache.clear();
            (0, globals_1.expect)(clearMock).toHaveBeenCalled();
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache['keys']).toEqual(null);
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache['lastFetch']).toEqual(0);
        });
    });
    (0, globals_1.describe)('helpers JwkCacheHelper isExpired', () => {
        (0, globals_1.it)('Deve retornar true se cache estiver expirado', () => {
            globals_1.jest.spyOn(Date, 'now').mockReturnValueOnce(JwkCacheHelper_1.JwkCache['lastFetch'] + JwkCacheHelper_1.JwkCache['ttl'] + 1);
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache.isExpired()).toBe(true);
        });
        (0, globals_1.it)('Deve retornar false se cache não estiver expirado', () => {
            globals_1.jest.spyOn(Date, 'now').mockReturnValueOnce(JwkCacheHelper_1.JwkCache['lastFetch'] + JwkCacheHelper_1.JwkCache['ttl'] - 1);
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache.isExpired()).toBe(false);
        });
    });
});
