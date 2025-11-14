import { Module } from '@nestjs/common';
import { WebsiteSettingService } from './website-setting.service';
import { WebsiteSettingController } from './website-setting.controller';
import { databaseProviders } from '@/database/database.provider';

@Module({
  controllers: [WebsiteSettingController],
  providers: [WebsiteSettingService,...databaseProviders],
})
export class WebsiteSettingModule {}
