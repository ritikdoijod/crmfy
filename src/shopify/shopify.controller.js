import { Controller, Dependencies, Bind, Req, Res, Get, Post } from '@nestjs/common';
import { ShopifyService } from './shopify.service';

@Controller()
@Dependencies(ShopifyService)
export class ShopifyController {
  constructor(shopifyService) {
    this.shopifyService = shopifyService;
  }

  @Get("/auth/callback")
  @Bind(Req())
  @Bind(Res())
  async handleAuthCallback(req, res) {
    try {
      const { session } = await this.shopifyService.getShopifyClient().auth.callback({
        rawRequest: req,
        rawResponse: res
      })

      const response = await this.shopifyService.getShopifyClient().webhooks.register({
        session
      })

      console.log("webhooks response", response);
    } catch (error) {
      console.log(error)
    }
  }

  @Post('shopify/webhooks/orders/create')
  @Bind(Res())
  async handleWebhookOrderCreate(req, res) {
    try {
      await this.shopifyService.getShopifyClient().webhooks.process({
        rawBody: req.body,
        rawRequest: req,
        rawResponse: res,
      })
    } catch (error) {
      console.log(error)
      // res.status(500).send(error.message)
    }
  }
}
