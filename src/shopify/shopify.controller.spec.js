import { Test } from '@nestjs/testing';
import { ShopifyController } from './shopify.controller';

describe('Shopify Controller', () => {
  let controller;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ShopifyController],
    }).compile();

    controller = module.get(ShopifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
