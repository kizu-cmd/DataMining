import { Body, Controller, Post } from '@nestjs/common';
import { UpsellService } from './upsell.service';
import { UpsellAcceptDto } from './dto/upsell-accept.dto';

@Controller('api/upsell')
export class UpsellController {
  constructor(private readonly upsellService: UpsellService) {}

  @Post('accept')
  async accept(@Body() payload: UpsellAcceptDto) {
    return this.upsellService.acceptSuggestion(payload);
  }
}
