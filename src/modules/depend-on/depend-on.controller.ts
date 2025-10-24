import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DependOnService } from './depend-on.service';
import { CreateDependOnDto } from './dto/create-depend-on.dto';
import { UpdateDependOnDto } from './dto/update-depend-on.dto';

@Controller('depend-on')
export class DependOnController {
  constructor(private readonly dependOnService: DependOnService) {}

  @Post()
  create(@Body() createDependOnDto: CreateDependOnDto) {
    return this.dependOnService.create(createDependOnDto);
  }

  @Get()
  findAll() {
    return this.dependOnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dependOnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDependOnDto: UpdateDependOnDto) {
    return this.dependOnService.update(+id, updateDependOnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dependOnService.remove(+id);
  }
}
