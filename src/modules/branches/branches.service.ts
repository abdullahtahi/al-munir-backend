import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { GlobalDbService } from "../global-db/global-db.service";
import { getErrorMessage, getPaginationOptions } from "@/helpers";
import { Op } from "sequelize";

@Injectable()
export class BranchesService {
  constructor(private readonly db: GlobalDbService) {}

  async create(createBranchDto: any) {
    try {
      const branch = await this.db.repo.Branch.create({
        ...createBranchDto,
      });
      return {
        branch,
        message: "Created Successfuklly",
      };
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  findAll(params) {
    try {
      let pagination = getPaginationOptions(params);
      const where: any = {};
      if (params?.name) {
        where[Op.and] = {
          name: { [Op.iLike]: `%${params.name.trim()}%` },
        };
      }
      if (params?.isActive) {
        where.isActive = params.isActive == "Active" ? true : false;
      }
      return this.db.repo.Branch.findAndCountAll({
        where,
        ...pagination,
      });
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} branch`;
  }

  update(id: string, updateBranchDto: any) {
    try {
      return this.db.repo.Branch.update(
        {
          ...updateBranchDto,
        },
        {
          where: { id },
        }
      );
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  remove(id: number) {
    try {
      return this.db.repo.Branch.update(
        {
          deletedAt: new Date(),
        },
        {
          where: { id },
        }
      );
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }
}
