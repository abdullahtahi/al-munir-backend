import { Module } from '@nestjs/common';
import { ConsultantModule } from '../consultant/consultant.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { databaseProviders } from '@/database/database.provider';
import { ConsultantService } from '../consultant/consultant.service';

@Module({
  imports: [ConsultantModule],
  controllers: [TransactionsController],
  providers: [TransactionsService,...databaseProviders],
  exports: [TransactionsService],
})
export class TransactionsModule { }
