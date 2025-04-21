import { Test } from '@nestjs/testing';
import { ShopifyService } from './shopify.service';

describe('ShopifyService', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ShopifyService],
    }).compile();

    service = module.get(ShopifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
