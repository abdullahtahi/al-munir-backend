import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdmissionsService } from './admissions.service';
import { AdmissionsController } from './admissions.controller';
import { BonusesModule } from '../bonuses/bonuses.module';
import { Admission } from 'models/admission.model';
import { ConsultantModule } from '../consultant/consultant.module';
import { databaseProviders } from '@/database/database.provider';
import { BonusesService } from '../bonuses/bonuses.service';
import { ConsultantService } from '../consultant/consultant.service';

@Module({
  controllers: [AdmissionsController],
  providers: [AdmissionsService, ...databaseProviders, ConsultantService, BonusesService],
  exports: [AdmissionsService],
})
export class AdmissionsModule { }
