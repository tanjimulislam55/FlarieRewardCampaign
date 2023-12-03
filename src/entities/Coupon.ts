import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column({ nullable: false })
  rewardId: number;
}
