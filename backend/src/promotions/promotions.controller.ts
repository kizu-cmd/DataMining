import { Body, Controller, Post } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { ActivatePromotionDto } from './dto/activate-promotion.dto';

@Controller('api/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post('activate')
  async activate(@Body() payload: ActivatePromotionDto) {
    return this.promotionsService.activatePromotion(payload);
  }
}
