import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule } from '@nestjs/throttler';
// Modules
import { AuthModule } from './modules/auth/auth.module';
import { ConsultantModule } from './modules/Consultant/Consultant.module';
import { UploadModule } from './modules/upload/upload.module';
import { DatabaseModule } from './database/database.module';
import { GlobalDbModule } from './modules/global-db/global-db.module';
import { StudentsModule } from './modules/students/students.module';
import { DependOnModule } from './modules/depend-on/depend-on.module';
import { BankModule } from './modules/bank/bank.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    GlobalDbModule,
    AuthModule,
    ConsultantModule,
    AdmissionsModule,
    UploadModule,
    StudentsModule,
    DependOnModule,
    BankModule,
  ],
  providers: [],
})
export class AppModule { }
