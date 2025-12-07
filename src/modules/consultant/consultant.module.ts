import { Module, forwardRef } from '@nestjs/common';
import { ConsultantService } from './consultant.service';
import { UsersController } from './consultant.controller';
import { databaseProviders } from '@/database/database.provider';
import { BonusesService } from '../bonuses/bonuses.service';
import { BonusesModule } from '../bonuses/bonuses.module';

@Module({
  imports: [forwardRef(() => BonusesModule)],
  controllers: [UsersController],
  providers: [ConsultantService, ...databaseProviders],
  exports: [ConsultantService],
})
export class ConsultantModule { }
