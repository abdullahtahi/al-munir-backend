import { Module } from '@nestjs/common';
import { ConsultantService } from './consultant.service';
import { UsersController } from './consultant.controller';
import { databaseProviders } from '@/database/database.provider';
import { BonusesService } from '../bonuses/bonuses.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [ConsultantService, ...databaseProviders],
  exports: [ConsultantService],
})
export class ConsultantModule { }
