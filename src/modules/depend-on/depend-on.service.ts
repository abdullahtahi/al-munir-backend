import { Injectable } from '@nestjs/common';
import { CreateDependOnDto } from './dto/create-depend-on.dto';
import { UpdateDependOnDto } from './dto/update-depend-on.dto';

@Injectable()
export class DependOnService {
  create(createDependOnDto: CreateDependOnDto) {
    return 'This action adds a new dependOn';
  }

  findAll() {
    return `This action returns all dependOn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dependOn`;
  }

  update(id: number, updateDependOnDto: UpdateDependOnDto) {
    return `This action updates a #${id} dependOn`;
  }

  remove(id: number) {
    return `This action removes a #${id} dependOn`;
  }
}
