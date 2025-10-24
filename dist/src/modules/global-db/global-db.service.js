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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalDbService = void 0;
const common_1 = require("@nestjs/common");
const _ = require("lodash");
const repositories_1 = require("../../constants/repositories");
let GlobalDbService = class GlobalDbService {
    constructor(userRepository, studentRepository, admissionRepository, dependOnRepository, bankRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.admissionRepository = admissionRepository;
        this.dependOnRepository = dependOnRepository;
        this.bankRepository = bankRepository;
        this.logger = new common_1.Logger('GlobalDbService');
        this.repo = {};
        this.repo.Consultant = this.userRepository;
        this.repo.Student = this.studentRepository;
        this.repo.Admission = this.admissionRepository;
        this.repo.DependOn = this.dependOnRepository;
        this.repo.Bank = this.bankRepository;
    }
    async getOne(model, params) {
        try {
            const result = await this.getAll(model, params);
            return (result.rows && _.first(result.rows)) || null;
        }
        catch (e) {
            this.logger.error('Error while saving ', e);
            throw new common_1.InternalServerErrorException();
        }
    }
    async getAll(model, params) {
        try {
            const options = { where: params.where || {} };
            if (params.attributes) {
                options.attributes = params.attributes;
            }
            return this.repo[model].findAndCountAll(options);
        }
        catch (e) {
            this.logger.error('Error while saving ', e);
            throw new common_1.InternalServerErrorException();
        }
    }
    async save(model, params, loggedInUser, transaction = null) {
        try {
            const { id } = params;
            params.updatedBy = loggedInUser.id;
            if (id) {
                return this.repo[model].update(params, { where: { id } }, transaction);
            }
            else {
                params.createdBy = loggedInUser.id;
                return this.repo[model].create(params, { transaction });
            }
        }
        catch (e) {
            this.logger.error('Error while saving ', e);
            throw new common_1.InternalServerErrorException();
        }
    }
    async delete(model, filter) {
        try {
            return await this.repo[model].destroy({ where: filter });
        }
        catch (e) {
            this.logger.error('Error while deleting ', e);
            throw new common_1.InternalServerErrorException();
        }
    }
};
exports.GlobalDbService = GlobalDbService;
exports.GlobalDbService = GlobalDbService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repositories_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(repositories_1.STUDENT_REPOSITORY)),
    __param(2, (0, common_1.Inject)(repositories_1.ADMISSION_REPOSITORY)),
    __param(3, (0, common_1.Inject)(repositories_1.DEPENDON_REPOSITORY)),
    __param(4, (0, common_1.Inject)(repositories_1.BANK_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GlobalDbService);
//# sourceMappingURL=global-db.service.js.map