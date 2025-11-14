import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WebsiteSettingService } from './website-setting.service';

@Controller('website-setting')
export class WebsiteSettingController {
  constructor(private readonly websiteSettingService: WebsiteSettingService) {}

  @Post()
  createAndUpdate(@Body() createWebsiteSettingDto: any) {
    return this.websiteSettingService.create(createWebsiteSettingDto);
  }

  @Get()
  findAll() {
    return this.websiteSettingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.websiteSettingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWebsiteSettingDto: any) {
    return this.websiteSettingService.update(+id, updateWebsiteSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.websiteSettingService.remove(+id);
  }
}
