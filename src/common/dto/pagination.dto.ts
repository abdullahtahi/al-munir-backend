import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PAGINATION } from '../constants';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = PAGINATION.DEFAULT_PAGE;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(PAGINATION.MAX_LIMIT)
  limit?: number = PAGINATION.DEFAULT_LIMIT;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
export class SearchUsersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  query?: string;
}

export class PaginatedResponseDto<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }
}

export class ResponseDto<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;

  constructor(success: boolean, data?: T, message?: string, error?: string) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
  }

  static success<T>(data?: T, message?: string): ResponseDto<T> {
    return new ResponseDto(true, data, message);
  }

  static error<T>(error: string, data?: T): ResponseDto<T> {
    return new ResponseDto(false, data, undefined, error);
  }
}
