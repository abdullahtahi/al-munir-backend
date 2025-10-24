import { models } from 'models';
import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let sequelize: Sequelize;

      // Ensure dialect is always set
      const dialect = process.env.DB_DIALECT || 'postgres'; // fallback to postgres

      if (process.env.DATABASE_URL) {
        // When using DATABASE_URL, pass options as second parameter
        sequelize = new Sequelize(process.env.DATABASE_URL, {
          dialect: dialect as any, // Explicitly cast to avoid TypeScript issues
          logging: false,
          // Uncomment if you need SSL
          // dialectOptions: {
          //   ssl: {
          //     require: true,
          //     rejectUnauthorized: false,
          //   },
          // },
        });
      } else {
        // When using individual parameters
        sequelize = new Sequelize({
          database: process.env.DATABASE_NAME,
          username: process.env.DB_USERNAME || process.env.DATABASE_USER, // Handle both variable names
          password: process.env.DATABASE_PASSWORD,
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT || '5432'),
          dialect: dialect as any,
          logging: false,
          // Uncomment if you need SSL
          // dialectOptions: {
          //   ssl: {
          //     require: true,
          //     rejectUnauthorized: false,
          //   },
          // },
        });
      }

      sequelize.addModels(models);

      try {
        await sequelize.sync();
        console.log('Database synchronized successfully');
      } catch (error) {
        console.error('Database synchronization error:', error);
        throw error; // Re-throw to prevent app from starting with broken DB
      }

      return sequelize;
    },
  },
];