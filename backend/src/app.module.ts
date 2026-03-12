import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MiningModule } from './mining/mining.module';
import { PromotionsModule } from './promotions/promotions.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UpsellModule } from './upsell/upsell.module';
import { CombosModule } from './combos/combos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as 'mysql' | 'sqlite') || 'sqlite',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'mining.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MiningModule,
    PromotionsModule,
    RecommendationsModule,
    TransactionsModule,
    UpsellModule,
    CombosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
