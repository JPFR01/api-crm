import {JwkKey} from '@/v1/domain/repository/keycloak/Keycloak';

export class JwkCache {
    private static keys: JwkKey[] | null = null;
    private static lastFetch = 0;
    private static readonly ttl = 60 * 60 * 1000;

    static get(): JwkKey[] | null {
        if (this.isExpired()) {
            this.clear();
        }
        return this.keys;
    }

    static set(keys: JwkKey[]): void {
        this.keys = keys;
        this.lastFetch = Date.now();
    }

    static clear(): void {
        this.keys = null;
        this.lastFetch = 0;
    }

    static isExpired(): boolean {
        return Date.now() - this.lastFetch > this.ttl;
    }
}
