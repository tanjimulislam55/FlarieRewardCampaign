// coupon.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { Coupon } from './entities/Coupon';
import { Player } from './entities/Player';
import { PlayerCoupon } from './entities/PlayerCoupon';
import { Reward } from './entities/Reward';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon, Player, PlayerCoupon, Reward])],
  providers: [CouponService],
  controllers: [CouponController],
})
export class CouponModule {}
