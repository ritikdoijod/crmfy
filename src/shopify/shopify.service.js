import { Injectable } from '@nestjs/common';
import "@shopify/shopify-api/adapters/node"
import { shopifyApi, ApiVersion, DeliveryMethod } from '@shopify/shopify-api';


@Injectable()
export class ShopifyService {
  constructor() {
    this.shopify = shopifyApi({
      scopes: ["read_orders"],
      apiVersion: ApiVersion.April25,
      isEmbeddedApp: false
    })

    this.shopify.webhooks.addHandlers({
      ORDERS_CREATE: [{
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/shopify/webhooks/orders/create",
        callback: this.handleOrdersCreate
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
