"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const apiPrefix = configService.get('API_PREFIX', 'api/v1');
    app.setGlobalPrefix(apiPrefix);
    const config = new swagger_1.DocumentBuilder()
        .addBearerAuth()
        .setTitle('Al-Munir Consultancy MLM API')
        .setDescription(`
      Complete MLM (Multi-Level Marketing) API for Al-Munir Consultancy's educational services platform.
      
      Features:
      - 🔐 JWT Authentication & Authorization
      - 👥 Multi-level user management (8 levels)
      - 🎯 Admission tracking (School, Academy, Technical)
      - 💰 Complex bonus calculation system
      - 🏆 Incentive and reward management
      - 📊 Comprehensive reporting and analytics
      - 💳 Transaction and withdrawal management
      
      Business Model:
      - Level 4 (Entry) → Level 1 → Manager → Senior Manager → Area Manager → Sector Head
      - Direct bonuses: 10%-30% based on level
      - Team bonuses: Multi-level commissions up to 4 levels
      - Global bonuses: 2%-4% for management positions
      - Technology & transportation incentives
      `)
        .setVersion('1.0')
        .addTag('Authentication', 'User registration, login, and profile management')
        .addTag('Consultant', 'User management and team structure')
        .addTag('Admissions', 'Educational service admissions management')
        .addTag('Bonuses', 'MLM bonus system and calculations')
        .addTag('Transactions', 'Financial transactions and withdrawals')
        .addServer(`http://localhost:${configService.get('PORT', 3000)}`, 'Development server')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.warn(`🚀 Al-Munir Consultancy API is running on: http://localhost:${port}`);
    console.warn(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.warn(`🔗 API Base URL: http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
//# sourceMappingURL=main.js.map