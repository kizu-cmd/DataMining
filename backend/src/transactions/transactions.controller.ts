import { Body, Controller, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { BulkTransactionsDto } from './dto/bulk-transactions.dto';

@Controller('api/orders')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async placeOrder(@Body() payload: PlaceOrderDto) {
    return this.transactionsService.placeOrder(payload);
  }

  @Post('bulk')
  async bulkIngest(@Body() payload: BulkTransactionsDto) {
    return this.transactionsService.ingestTransactions(payload);
  }
}
