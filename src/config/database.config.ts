// import { ConfigService } from '@nestjs/config';
// import { SequelizeModuleOptions } from '@nestjs/sequelize';
// import { User, Admission, Bonus, Incentive, Transaction, Franchise } from '../database/models';

// export const databaseConfig = (configService: ConfigService): SequelizeModuleOptions => ({
//   dialect: 'postgres',
//   host: configService.get('DATABASE_HOST'),
//   port: configService.get('DATABASE_PORT'),
//   username: configService.get('DATABASE_USER'),
//   password: configService.get('DATABASE_PASSWORD'),
//   database: configService.get('DATABASE_NAME'),
//   models: [User, Admission, Bonus, Incentive, Transaction, Franchise],
//   synchronize: configService.get('NODE_ENV') === 'development',
//   logging: configService.get('NODE_ENV') === 'development' ? console.log : false,
//   pool: {
//     max: 10,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
//   define: {
//     timestamps: true,
//     underscored: true,
//     freezeTableName: true,
//   },
// });
