import {
  Controller,
  Dependencies,
  Bind,
  Req,
  Res,
  Get,
  Post,
  Query
} from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { ConfigService } from '@nestjs/config';

@Controller('shopify')
@Dependencies([ConfigService, ShopifyService])
export class ShopifyController {
  constructor(configService, shopifyService) {
    this.configService = configService;
    this.shopifyService = shopifyService;
  }

  @Get('auth')
  @Bind(Query(), Req(), Res())
  async auth(query, req, res) {
    try {
      await this.shopifyService.getShopifyClient().auth.begin({
        shop: this.shopifyService.getShopifyClient().utils.sanitizeShop(query.shop, true),
        callbackPath: "/shopify/auth/callback",
        isOnline: false,
        rawRequest: req,
        rawResponse: res
      })
      return;
    } catch (error) {
      console.log("error in auth: ", error);
    }
  }

  @Get('/auth/callback')
  @Bind(Req(), Res())
  async handleAuthCallback(req, res) {
    try {
      const { session } = await this.shopifyService
        .getShopifyClient()
        .auth.callback({
          rawRequest: req,
          rawResponse: res,
        });

      await this.shopifyService
        .getShopifyClient()
        .webhooks.register({
          session,
        });

      return;
    } catch (error) {
      console.log("error in auth callback: ", error);
    }
  }

  @Post('webhooks/orders/create')
  @Bind(Req())
  @Bind(Res())
  async handleWebhookOrderCreate(req, res) {
    try {
      await this.shopifyService.getShopifyClient().webhooks.process({
        rawBody: req.body,
        rawRequest: req,
        rawResponse: res,
      });
      return req.body;
    } catch (error) {
      console.log("error in webhook: ", error);
      // res.status(500).send(error.message)
    }
  }
}
