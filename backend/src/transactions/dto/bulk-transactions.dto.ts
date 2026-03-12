export class TransactionRowDto {
  order_id: string;
  item: string;
}

export class BulkTransactionsDto {
  rows: TransactionRowDto[];
}
