import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../common';
import { catchError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from '../config';

@Controller('products')
export class ProductsController {
	constructor(
		@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
	) {}

	@Post()
	create(@Body() createProductDto: CreateProductDto) {
		return this.natsClient.send('create_product', createProductDto).pipe(
			catchError((error) => {
				throw new RpcException(error);
			})
		);
	}

	@Get()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.natsClient.send('find_all_products', paginationDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.natsClient.send('find_one_product', { id }).pipe(
			catchError((error) => {
				throw new RpcException(error);
			})
		);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateProductDto: UpdateProductDto
	) {
		return this.natsClient
			.send('update_product', { id, ...updateProductDto })
			.pipe(
				catchError((error) => {
					throw new RpcException(error);
				})
			);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.natsClient.send('remove_product', { id }).pipe(
			catchError((error) => {
				throw new RpcException(error);
			})
		);
	}
}
