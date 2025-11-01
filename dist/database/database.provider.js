"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const models_1 = require("models");
const sequelize_typescript_1 = require("sequelize-typescript");
exports.databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            let sequelize;
            const dialect = process.env.DB_DIALECT || 'postgres';
            if (process.env.DATABASE_URL) {
                sequelize = new sequelize_typescript_1.Sequelize(process.env.DATABASE_URL, {
                    dialect: dialect,
                    logging: false,
                });
            }
            else {
                sequelize = new sequelize_typescript_1.Sequelize({
                    database: process.env.DATABASE_NAME,
                    username: process.env.DB_USERNAME || process.env.DATABASE_USER,
                    password: process.env.DATABASE_PASSWORD,
                    host: process.env.DATABASE_HOST,
                    port: parseInt(process.env.DATABASE_PORT || '5432'),
                    dialect: dialect,
                    logging: false,
                });
            }
            sequelize.addModels(models_1.models);
            try {
                await sequelize.sync();
                console.log('Database synchronized successfully');
            }
            catch (error) {
                console.error('Database synchronization error:', error);
                throw error;
            }
            return sequelize;
        },
    },
];
//# sourceMappingURL=database.provider.js.map