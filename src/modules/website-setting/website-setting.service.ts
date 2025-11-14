import { Injectable } from "@nestjs/common";
import { GlobalDbService } from "../global-db/global-db.service";

@Injectable()
export class WebsiteSettingService {
  constructor(private readonly db: GlobalDbService) {}
  async create(createWebsiteSettingDto: any) {
    let websiteSetting:any; 
    if (createWebsiteSettingDto?.id !== null) {
      websiteSetting = await this.db.repo.WebsiteSetting.create({
        ...createWebsiteSettingDto,
      });
    } else {
     websiteSetting = await this.db.repo.WebsiteSetting.update(
        {
          ...createWebsiteSettingDto,
        },
        {
          where: {
            id: createWebsiteSettingDto.id,
          },
        }
      );
    }
    return websiteSetting 
  }

  findAll() {
    return this.db.repo.WebsiteSetting.findOne();
  }

  findOne(id: number) {
    return `This action returns a #${id} websiteSetting`;
  }

  update(id: number, updateWebsiteSettingDto: any) {
    return `This action updates a #${id} websiteSetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} websiteSetting`;
  }
}
