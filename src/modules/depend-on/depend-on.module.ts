import { Module } from '@nestjs/common';
import { DependOnService } from './depend-on.service';
import { DependOnController } from './depend-on.controller';

@Module({
  controllers: [DependOnController],
  providers: [DependOnService],
})
export class DependOnModule {}
