import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class PlayerCoupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  playerId: number;

  @Column({ nullable: false })
  couponId: number;

  @CreateDateColumn()
  redeemedAt: Date;
}
