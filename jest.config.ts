import type {Config} from 'jest';
require('dotenv').config();

let config: Config = {};

if (process.env.NODE_ENV !== 'production') {
    config = {
        roots: ['<rootDir>/src'],
        testEnvironment: 'node',
        transform: {
            '.+\\.ts$': 'ts-jest',
        },
        moduleNameMapper: {
            '@/(.*)': '<rootDir>/src/$1',
        },
        testTimeout: 20000,
        collectCoverage: true,
        collectCoverageFrom: ['src/**/*.ts', '!src/infrastructure/swagger/**', '!src/main/**', '!src/v1/presentation/controllers/swagger/docs/**'],
        coverageDirectory: 'coverage',
        coverageReporters: ['text', 'lcov'],
    };
}

export default config;
