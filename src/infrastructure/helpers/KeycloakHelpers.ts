export function buildAuthParams(grantType: 'password' | 'refresh_token', extraParams: Record<string, string>): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();

    params.append('client_id', process.env.KEYCLOAK_NAME_CLIENT!);
    params.append('client_secret', process.env.KEYCLOAK_CLIENT_KEY!);
    params.append('grant_type', grantType);

    for (const [key, value] of Object.entries(extraParams)) {
        params.append(key, value);
    }

    return params;
}

export function convertBase64ToPem(base64Cert: string): string {
    const certChunks: RegExpMatchArray | null = base64Cert.match(/.{1,64}/g);
    return `-----BEGIN CERTIFICATE-----\n${certChunks?.join('\n')}\n-----END CERTIFICATE-----`;
}
