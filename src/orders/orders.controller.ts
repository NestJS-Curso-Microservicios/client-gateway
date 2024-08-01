import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, PaginationOrderDto, StatusDto } from './dto';
import { catchError } from 'rxjs';
import { PaginationDto } from '../common';
import { NATS_SERVICE } from '../config';

@Controller('orders')
export class OrdersController {
	constructor(
		@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
	) {}

	@Post()
	create(@Body() createOrderDto: CreateOrderDto) {
		return this.natsClient.send('createOrder', createOrderDto).pipe(
			catchError((error) => {
				throw new RpcException(error);
			})
		);
	}

	@Get()
	findAll(@Query() paginationOrderDto: PaginationOrderDto) {
		return this.natsClient.send('findAllOrders', paginationOrderDto).pipe(
			catchError((error) => {
				throw new RpcException(error);
			})
		);
	}

	@Get(':status')
	findAllByStatus(
		@Param() status: StatusDto,
		@Query() paginationDto: PaginationDto
	) {
		return this.natsClient
			.send('findAllOrders', { ...status, ...paginationDto })
			.pipe(
				catchError((error) => {
					throw new RpcException(error);
				})
			);
	}

	@Get('id/:id')
	findOne(@Param('id') id: string) {
		return this.natsClient.send('findOneOrder', id).pipe(
			catchError((error) => {
				throw new RpcException(error);
			})
		);
	}

	@Patch(':id')
	changeStatus(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() statusDto: StatusDto
	) {
		return this.natsClient
			.send('changeOrderStatus', { id, ...statusDto })
			.pipe(
				catchError((error) => {
					throw new RpcException(error);
				})
			);
	}
}
