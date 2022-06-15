export interface UserData {
    username: string;
    password: string;
    name: string;
    email: string;
    id: number;
    forget_pwd: string;
    slogan: string;
    created_at: string;
}

export interface DbResult {
    affectedRows: number;
    insertId: number;
    message: string;
    protocol41: boolean;
    changedRows: number;
    fieldCount: number;
    serverStatus: number;
    warningCount: number;
}

export interface ChangePasswordData {
    oldPassword: string;
    newPassword: string;
}