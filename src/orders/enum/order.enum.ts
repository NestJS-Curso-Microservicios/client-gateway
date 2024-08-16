export enum OrderStatus {
	PENDING = 'PENDING',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
	PAID = 'PAID'
}

export const OrderStatusList = [
	OrderStatus.PENDING,
	OrderStatus.COMPLETED,
	OrderStatus.CANCELLED,
	OrderStatus.PAID
];
