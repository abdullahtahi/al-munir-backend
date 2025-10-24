import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BonusesService } from './bonuses.service';
import { BonusesController } from './bonuses.controller';
import { ConsultantModule } from '../consultant/consultant.module';

@Module({
  imports: [
    forwardRef(() => ConsultantModule),
  ],
  controllers: [BonusesController],
  providers: [BonusesService],
  exports: [BonusesService],
})
export class BonusesModule { }
