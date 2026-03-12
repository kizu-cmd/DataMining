import { Body, Controller, Get, Post } from '@nestjs/common';
import { MiningService } from './mining.service';
import { AnalysisRequestDto } from './dto/analysis-request.dto';

@Controller('api/analysis')
export class MiningController {
  constructor(private readonly miningService: MiningService) {}

  @Get()
  async getAnalysis() {
    return this.miningService.getLatestAnalysis();
  }

  @Post()
  async analyze(@Body() payload: AnalysisRequestDto) {
    const transactions = payload?.transactions ?? [];
    const rows = transactions.flatMap((items, idx) =>
      items.map((item) => ({ order_id: `t${idx}`, item })),
    );

    const output = await this.miningService.runPythonWorker(rows as any);

    return {
      frequentItemsets: output.frequent_itemsets.map((f) => ({
        items: f.items,
        support: f.support,
        count: f.count,
      })),
      rules: output.rules.map((r) => ({
        antecedent: r.antecedents.join(' + '),
        consequent: r.consequents.join(' + '),
        support: r.support,
        confidence: r.confidence,
        lift: r.lift,
        leverage: r.leverage,
        conviction: r.conviction,
      })),
    };
  }
}
