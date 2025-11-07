export interface LoginData {
    body: LoginBody;
}

export interface LoginBody {
    usernameOrEmail: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
    refreshToken: string;
    tokenType: string;
    givenName?: string;
    familyName?: string;
}

export interface Login {
    validate: (data: LoginData) => Promise<void>;
    login: (data: LoginData) => Promise<LoginResponse>;
}
