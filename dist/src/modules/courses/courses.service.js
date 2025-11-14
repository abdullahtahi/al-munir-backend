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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const helpers_1 = require("../../helpers");
const sequelize_1 = require("sequelize");
const global_db_service_1 = require("../global-db/global-db.service");
let CoursesService = class CoursesService {
    constructor(db) {
        this.db = db;
    }
    async create(createBranchDto) {
        try {
            const branch = await this.db.repo.Course.create({
                ...createBranchDto,
            });
            return {
                branch,
                message: "Created Successfuklly",
            };
        }
        catch (error) {
            throw new common_1.BadRequestException((0, helpers_1.getErrorMessage)(error));
        }
    }
    findAll(params) {
        try {
            console.log("line 26", params);
            let pagination = (0, helpers_1.getPaginationOptions)(params);
            const where = {};
            if (params?.name) {
                where[sequelize_1.Op.and] = {
                    name: { [sequelize_1.Op.iLike]: `%${params.name.trim()}%` },
                };
            }
            if (params?.isActive) {
                where.isActive = params.isActive == "Active" ? true : false;
            }
            console.log("line 37", where);
            return this.db.repo.Course.findAndCountAll({
                where,
                ...pagination,
            });
        }
        catch (error) {
            console.log("working", error);
            throw new common_1.BadRequestException((0, helpers_1.getErrorMessage)(error));
        }
    }
    findOne(id) {
        return `This action returns a #${id} course`;
    }
    update(id, update) {
        try {
            return this.db.repo.Course.update({
                ...update,
            }, {
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException((0, helpers_1.getErrorMessage)(error));
        }
    }
    remove(id) {
        try {
            return this.db.repo.Course.update({
                deletedAt: new Date(),
            }, {
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException((0, helpers_1.getErrorMessage)(error));
        }
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [global_db_service_1.GlobalDbService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map