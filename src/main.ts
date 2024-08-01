import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
	const logger = new Logger('Bootstrap-Gateway');
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	);
	app.useGlobalFilters(new RpcCustomExceptionFilter());

	await app.listen(envs.port);
	logger.log(`Gateway is running on http://localhost:${envs.port}`);
}
bootstrap().then(() => {
	console.log('Gateway is running');
});
