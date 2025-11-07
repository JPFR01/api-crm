"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwkCache = void 0;
class JwkCache {
    static get() {
        if (this.isExpired()) {
            this.clear();
        }
        return this.keys;
    }
    static set(keys) {
        this.keys = keys;
        this.lastFetch = Date.now();
    }
    static clear() {
        this.keys = null;
        this.lastFetch = 0;
    }
    static isExpired() {
        return Date.now() - this.lastFetch > this.ttl;
    }
}
exports.JwkCache = JwkCache;
JwkCache.keys = null;
JwkCache.lastFetch = 0;
JwkCache.ttl = 60 * 60 * 1000;
