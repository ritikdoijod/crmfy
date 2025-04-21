import {
  Controller,
  Dependencies,
  Bind,
  Req,
  Res,
  Get,
  Post,
  HttpCode,
  Redirect,
  Query,
} from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { ConfigService } from '@nestjs/config';

@Controller('shopify')
@Dependencies(ConfigService)
@Dependencies(ShopifyService)
export class ShopifyController {
  constructor(configService, shopifyService) {
    this.configService = configService;
    this.shopifyService = shopifyService;
  }

  @Get('init')
  @HttpCode(302)
  @Redirect()
  async init(@Query query) {
    return {
      url: `https://${query.shop}/admin/oauth/authorize?client_id=${this.configService.get('shopify.appProxy.clientId')}&scope=${this.configService.get('shopify.appProxy.scopes').join(',')}&redirect_uri=${this.configService.get('appUrl')}/shopify/auth/callback&state={nonce}&grant_options[]={access_mode}`,
    };
  }

  @Get('/auth/callback')
  @Bind(Req())
  @Bind(Res())
  async handleAuthCallback(req, res) {
    try {
      const { session } = await this.shopifyService
        .getShopifyClient()
        .auth.callback({
          rawRequest: req,
          rawResponse: res,
        });

      const response = await this.shopifyService
        .getShopifyClient()
        .webhooks.register({
          session,
        });

      console.log('webhooks response', response);
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message)
    }
  }
}
