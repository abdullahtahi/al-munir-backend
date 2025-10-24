export interface CurrentUserInfo {
    id: number;
    email: string;
    role: string;
    level: number;
    status: string;
}
export declare const CurrentUser: (...dataOrPipes: any[]) => ParameterDecorator;
