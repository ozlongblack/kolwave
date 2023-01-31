import {defineConfig, CookieSessionStorage} from '@shopify/hydrogen/config';

export default defineConfig({
  shopify: {
    defaultCountryCode: 'US',
    defaultLanguageCode: 'EN',
    storeDomain:
      // @ts-ignore
      'kolwave.myshopify.com',
    // Oxygen?.env?.PUBLIC_STORE_DOMAIN || 'hydrogen-preview.myshopify.com',
    storefrontToken:
      // @ts-ignore
      '39de562514590729977eab331a1e9ebd',
    // Oxygen?.env?.PUBLIC_STOREFRONT_API_TOKEN || '3b580e70970c4528da70c98e097c2fa0'
    privateStorefrontToken:
      // @ts-ignore
      undefined,
    // Oxygen?.env?.PRIVATE_STOREFRONT_API_TOKEN,
    storefrontApiVersion: '2023-01',
    // @ts-ignore
    storefrontId: undefined,
    // storefrontId: Oxygen?.env?.PUBLIC_STOREFRONT_ID,
  },
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
