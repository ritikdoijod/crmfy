import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cookieSession({
      // TODO: set secret in env
      name: "session",
      keys: ["test"],
      secure: true,
      httpOnly: true
    })
  )

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
