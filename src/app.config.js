export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    environment: process.env.NODE_ENV || "development",
    appUrl: process.env.APP_URL || "http://localhost:3000",
    corsAllowedUrls: "*",
    shopify: {
        appProxy: {
            clientId: process.env.SHOPIFY_APP_PROXY_KEY,
            clientSecret: process.env.SHOPIFY_APP_PROXY_SECRET,
            scopes: [
                'write_orders',
                'read_orders'
            ]
        }
    }
})