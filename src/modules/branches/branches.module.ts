import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { databaseProviders } from '@/database/database.provider';

@Module({
  controllers: [BranchesController],
  providers: [BranchesService,...databaseProviders],
})
export class BranchesModule {}
