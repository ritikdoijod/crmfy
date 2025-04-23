import { Injectable, Dependencies } from '@nestjs/common';
import "@shopify/shopify-api/adapters/node"
import { shopifyApi, ApiVersion, DeliveryMethod } from '@shopify/shopify-api';
import { ConfigService } from '@nestjs/config';

@Injectable()
@Dependencies(ConfigService)
export class ShopifyService {
  constructor(configService) {
    this.configService = configService;

    this.shopify = shopifyApi({
      apiKey: this.configService.get('shopify.appProxy.clientId'),
      apiSecretKey: this.configService.get('shopify.appProxy.clientSecret'),
      scopes: this.configService.get('shopify.appProxy.scopes'),
      apiVersion: ApiVersion.April25,
      isEmbeddedApp: false,
      hostName: this.configService.get('appUrl')
    })

    this.shopify.webhooks.addHandlers({
      ORDERS_CREATE: [{
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/shopify/webhooks/orders/create",
        callback: this.handleOrdersCreate,
        includeFields: ["id"]
      }]
    })
  }

  async handleOrdersCreate(topic, shop, webhookRequestBody, webhookId, apiVersion) {
    try {
      console.log(topic, shop, webhookRequestBody, webhookId, apiVersion)
    } catch (error) {
      console.log(error)
    }
  }

  getShopifyClient() {
    return this.shopify;
  }
}
