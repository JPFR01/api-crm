export interface HealthCheck {
    check: () => Promise<string>;
}
