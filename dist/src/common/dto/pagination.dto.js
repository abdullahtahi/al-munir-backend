"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseDto = exports.PaginatedResponseDto = exports.SearchUsersDto = exports.PaginationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const constants_1 = require("../constants");
class PaginationDto {
    constructor() {
        this.page = constants_1.PAGINATION.DEFAULT_PAGE;
        this.limit = constants_1.PAGINATION.DEFAULT_LIMIT;
    }
    get offset() {
        return (this.page - 1) * this.limit;
    }
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(constants_1.PAGINATION.MAX_LIMIT),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
class SearchUsersDto extends PaginationDto {
}
exports.SearchUsersDto = SearchUsersDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUsersDto.prototype, "query", void 0);
class PaginatedResponseDto {
    constructor(data, total, page, limit) {
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
exports.PaginatedResponseDto = PaginatedResponseDto;
class ResponseDto {
    constructor(success, data, message, error) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
    }
    static success(data, message) {
        return new ResponseDto(true, data, message);
    }
    static error(error, data) {
        return new ResponseDto(false, data, undefined, error);
    }
}
exports.ResponseDto = ResponseDto;
//# sourceMappingURL=pagination.dto.js.map