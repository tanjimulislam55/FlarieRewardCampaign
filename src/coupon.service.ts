import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/Coupon';
import { Repository } from 'typeorm';
import { Player } from './entities/Player';
import { PlayerCoupon } from './entities/PlayerCoupon';
import { Reward } from './entities/Reward';

interface Responseinterface {
  id: number;
  value: string;
}

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(PlayerCoupon)
    private readonly playerCouponRepository: Repository<PlayerCoupon>,
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
  ) {}

  async redeemCoupon(
    playerId: number,
    rewardId: number,
  ): Promise<Responseinterface | undefined> {
    const today = new Date();

    if (!playerId || !rewardId)
      throw new ForbiddenException('Required params are missing');

    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });
    const reward = await this.rewardRepository.findOne({
      where: { id: rewardId },
    });

    if (!player || !reward)
      throw new NotFoundException('Player or reward not found');

    if (today < reward.startDate || today > reward.endDate)
      throw new NotFoundException('This reward is currently not available');

    const playerCouponCounts = await this.playerCouponRepository
      .createQueryBuilder('playerCoupon')
      .select(
        '(SELECT COUNT(*) FROM player_coupon WHERE playerId = :playerId AND DATE(redeemedAt) = CURDATE())',
        'perDayLimit',
      )
      .addSelect('COUNT(*)', 'totalLimit')
      .where('playerCoupon.playerId = :playerId', { playerId })
      .getRawOne();

    if (
      playerCouponCounts.perDayLimit >= reward.perDayLimit ||
      playerCouponCounts.totalLimit >= reward.totalLimit
    )
      throw new BadRequestException('Daily redemption limit reached');

    const coupon = await this.couponRepository.findOne({
      where: { rewardId: rewardId },
    });

    if (!coupon) throw new NotFoundException('Coupon not been initialized yet');

    const playerCoupon = await this.playerCouponRepository.findOne({
      where: {
        couponId: coupon.id,
      },
    });

    if (playerCoupon)
      throw new NotAcceptableException('Coupon already returned');

    const newPlayerCoupon = this.playerCouponRepository.create({
      redeemedAt: new Date(),
      playerId,
      couponId: coupon.id,
    });
    await this.playerCouponRepository.save(newPlayerCoupon);

    return { id: coupon.id, value: coupon.value };
  }
}

//   private async findAvailableCoupon(
//     reward: Reward,
//   ): Promise<Coupon | undefined> {
//     return reward.coupons.find((coupon) => !coupon.redeemed);
//   }
// }

// reward.coupons.length > 0
// await this.couponRepository.update(availableCoupon.id, { redeemed: true });
