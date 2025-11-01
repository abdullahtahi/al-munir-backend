import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { databaseProviders } from '@/database/database.provider';
import { ConsultantService } from '../consultant/consultant.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService,ConsultantService,...databaseProviders],
  exports: [TransactionsService],
})
export class TransactionsModule { }
