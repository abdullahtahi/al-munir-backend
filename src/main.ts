import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    // origin: configService.get('CORS_ORIGIN'),
    // credentials: true,
    origin: true,  // allows ALL origins
    credentials: true,
  });

  // Global prefix
  const apiPrefix = configService.get('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Swagger Configuration
  const config = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document,
    // {
    // swaggerOptions: {
    //   authAction: {
    //     bearerAuth: {
    //       name: 'bearerAuth',
    //       // schema: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    //       value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg2ZDNkODVlLTJjZGEtNDYyOC1iOWIwLWRlNWZkODliNjVhMSIsImZpcnN0X25hbWUiOiJKb2huIiwibGFzdF9uYW1lIjoiRG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInBob25lIjoiKzkyMzAwMTIzNDU2NyIsImNuaWMiOiIxMjM0NS02Nzg5MDEyLTMiLCJhZGRyZXNzIjoiMTIzIE1haW4gU3RyZWV0LCBMYWhvcmUiLCJjaXR5IjoiTGFob3JlIiwicm9sZSI6InVzZXIiLCJsZXZlbCI6NCwic3RhdHVzIjoicGVuZGluZyIsInNwb25zb3JfaWQiOm51bGwsInJlZmVycmFsX2NvZGUiOiJBQkMxMjMiLCJ0b3RhbF9lYXJuaW5ncyI6MCwiYXZhaWxhYmxlX2JhbGFuY2UiOjAsIndpdGhkcmF3bl9hbW91bnQiOjAsInNjaG9vbF9hZG1pc3Npb25zIjowLCJhY2FkZW15X2FkbWlzc2lvbnMiOjAsInRlY2huaWNhbF9hZG1pc3Npb25zIjowLCJjb21wbGV0aW9uX3JhdGUiOiIwLjAwIiwibGFzdF9sb2dpbiI6bnVsbCwicHJvZmlsZV9zZXR0aW5ncyI6bnVsbCwibm90aWZpY2F0aW9uX3ByZWZlcmVuY2VzIjpudWxsLCJlbWFpbF92ZXJpZmllZF9hdCI6bnVsbCwicGhvbmVfdmVyaWZpZWRfYXQiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjUtMDgtMDhUMDg6NTg6MzEuNDczWiIsInVwZGF0ZWRBdCI6IjIwMjUtMDgtMDhUMDg6NTg6MzEuNDczWiIsImlhdCI6MTc1NDY2NTYwNH0.Pk7J6PO5nEQO7RcHHHSYlWZnXHoV5oomlEGadcWmh1g',
    //     },
    //   },
    // },
    // }
  );

  const port = configService.get('PORT', 3000);
  await app.listen(port);

  console.warn(`🚀 Al-Munir Consultancy API is running on: http://localhost:${port}`);
  console.warn(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.warn(`🔗 API Base URL: http://localhost:${port}/${apiPrefix}`);
}

bootstrap();
