export declare class PaginationDto {
    page?: number;
    limit?: number;
    get offset(): number;
}
export declare class SearchUsersDto extends PaginationDto {
    query?: string;
}
export declare class PaginatedResponseDto<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    constructor(data: T[], total: number, page: number, limit: number);
}
export declare class ResponseDto<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    constructor(success: boolean, data?: T, message?: string, error?: string);
    static success<T>(data?: T, message?: string): ResponseDto<T>;
    static error<T>(error: string, data?: T): ResponseDto<T>;
}
