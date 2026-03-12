import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboCreationEntity } from './combo-creation.entity';
import { CombosController } from './combos.controller';
import { CombosService } from './combos.service';

@Module({
  imports: [TypeOrmModule.forFeature([ComboCreationEntity])],
  controllers: [CombosController],
  providers: [CombosService],
})
export class CombosModule {}
