import { Test, TestingModule } from '@nestjs/testing';
import { CouponService } from '../src/coupon.service';
import { CouponController } from './coupon.controller';

describe('CouponService', () => {
  let couponService: CouponService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponController],
      providers: [CouponService],
    }).compile();

    couponService = module.get<CouponService>(CouponService);
  });

  it('should redeem a coupon for a valid player and reward', async () => {
    const result = await couponService.redeemCoupon(1, 2);

    expect(result).toBeDefined();
  });

  it('should handle cases where redemption limits are exceeded', async () => {
    try {
      await couponService.redeemCoupon(1, 1);
    } catch (error) {
      expect(error.message).toEqual('Daily redemption limit reached');
    }
  });
});
