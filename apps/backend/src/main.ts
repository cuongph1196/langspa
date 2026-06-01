import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Prefix API toàn cục
  app.setGlobalPrefix('api')

  // Cấu hình CORS cho frontend
  app.enableCors({
    origin: ['http://localhost:3000',"https://1b652d37.langspa.pages.dev"],
    credentials: true,
  })

  // Validation pipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  // Interceptor chuẩn hóa response
  app.useGlobalInterceptors(new TransformInterceptor())

  // Cấu hình Swagger API docs
  const config = new DocumentBuilder()
    .setTitle('Láng Spa API')
    .setDescription('API documentation cho website Láng Spa')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`🚀 Láng Spa Backend đang chạy tại: http://localhost:${port}`)
  console.log(`📖 API Docs: http://localhost:${port}/api/docs`)
}
bootstrap()
