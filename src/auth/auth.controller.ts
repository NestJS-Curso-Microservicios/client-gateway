import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from '../config';
import { LoginUserAuthDto, RegisterUserAuthDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUserInterface } from './interfaces/current-user.interface';
import { Token, User } from './decorators';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
	) {}

	@Post('register-user')
	registerUser(@Body() registerUserAuthDto: RegisterUserAuthDto) {
		return this.natsClient
			.send('auth.register.user', registerUserAuthDto)
			.pipe(
				catchError((error) => {
					throw new RpcException(error);
				})
			);
	}

	@Post('login-user')
	loginUser(@Body() loginUserAuthDto: LoginUserAuthDto) {
		return this.natsClient.send('auth.login.user', loginUserAuthDto).pipe(
			catchError((error) => {
				throw new RpcException(error);
			})
		);
	}

	@UseGuards(AuthGuard)
	@Get('verify-user')
	verifyUser(@User() user: CurrentUserInterface, @Token() token: string) {
		return { user, token };
	}
}
