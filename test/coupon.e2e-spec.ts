import { Test, TestingModule } from '@nestjs/testing';
import { CouponModule } from '../src/coupon.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('CouponController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CouponModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should redeem a coupon for a valid player and reward', async () => {
    const response = await request(app.getHttpServer())
      .post('/coupon-redeem')
      .send({ playerId: 99, rewardId: 1 })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.value).toBeDefined();
  });

  it('should handle cases where redemption limits are exceeded', async () => {
    const response = await request(app.getHttpServer())
      .post('/coupon-redeem')
      .send({
        playerId: 2,
        rewardId: 1,
      })
      .expect(400);

    expect(response.body.message).toEqual('Daily redemption limit reached');
  });
});
