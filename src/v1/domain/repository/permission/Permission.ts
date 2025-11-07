export interface PermissionData {
    usernameOrEmail: string;
}

export interface PermissionResponse {
    hasPermission: boolean;
}

export interface Permission {
    validate(data: PermissionData): Promise<void>;
}
