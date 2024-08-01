import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';

export class PaginationOrderDto extends PaginationDto {
	@IsOptional()
	@IsEnum(OrderStatusList, {
		message: `Status must be one of the following values: ${Object.values(
			OrderStatusList
		).join(', ')}`,
	})
	status: OrderStatus;
}
