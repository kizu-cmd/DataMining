export interface PlaceOrderItemDto {
  id?: string;
  name: string;
  price?: number;
  quantity: number;
}

export class PlaceOrderDto {
  items: PlaceOrderItemDto[];
  total: number;
}
