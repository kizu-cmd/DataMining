import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpsellSelectionEntity } from './upsell-selection.entity';
import { UpsellController } from './upsell.controller';
import { UpsellService } from './upsell.service';

@Module({
  imports: [TypeOrmModule.forFeature([UpsellSelectionEntity])],
  controllers: [UpsellController],
  providers: [UpsellService],
})
export class UpsellModule {}
