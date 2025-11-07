declare module 'winston-azure-application-insights' {
    import TransportStream from 'winston-transport';

    export interface AzureApplicationInsightsLoggerOptions {
        instrumentationKey?: string;
        client?: any;
    }

    export class AzureApplicationInsightsLogger extends TransportStream {
        constructor(options?: AzureApplicationInsightsLoggerOptions);
    }
}
