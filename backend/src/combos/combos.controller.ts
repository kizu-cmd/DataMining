import { Body, Controller, Post } from '@nestjs/common';
import { CombosService } from './combos.service';
import { CreateComboDto } from './dto/create-combo.dto';

@Controller('api/combos')
export class CombosController {
  constructor(private readonly combosService: CombosService) {}

  @Post('create')
  async create(@Body() payload: CreateComboDto) {
    return this.combosService.createCombo(payload);
  }
}
