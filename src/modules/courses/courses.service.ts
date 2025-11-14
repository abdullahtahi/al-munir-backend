import { BadRequestException, Injectable } from '@nestjs/common';
import { getErrorMessage, getPaginationOptions } from '@/helpers';
import { Op } from 'sequelize';
import { GlobalDbService } from '../global-db/global-db.service';

@Injectable()
export class CoursesService {
  constructor(private readonly db: GlobalDbService) {}

  async create(createBranchDto: any) {
    try {
      const branch = await this.db.repo.Course.create({
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
      return this.db.repo.Course.findAndCountAll({
        where,
        ...pagination,
      });
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: string, update: any) {
    try {
      return this.db.repo.Course.update(
        {
          ...update,
        },
        {
          where: { id },
        }
      );
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  remove(id: any) {
    try {
      return this.db.repo.Course.update(
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
