import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BonusesService } from './bonuses.service';
import { BonusesController } from './bonuses.controller';
import { ConsultantModule } from '../consultant/consultant.module';
import { databaseProviders } from '@/database/database.provider';
import { ConsultantService } from '../consultant/consultant.service';

@Module({
  imports: [ConsultantModule],
  controllers: [BonusesController],
  providers: [BonusesService,...databaseProviders],
  exports: [BonusesService],
})
export class BonusesModule { }
