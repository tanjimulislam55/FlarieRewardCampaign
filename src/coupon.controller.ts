import { Body, Controller, Post } from '@nestjs/common';
import { CouponService } from './coupon.service';

interface Responseinterface {
  id: number;
  value: string;
}

@Controller('coupon-redeem')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  async redeemCoupon(
    @Body() body: { playerId: number; rewardId: number },
  ): Promise<Responseinterface> {
    return this.couponService.redeemCoupon(body.playerId, body.rewardId);
  }
}
