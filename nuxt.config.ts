// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    ETH_PRIVATE_KEY: process.env.ETH_PRIVATE_KEY,
    THIRDWEB_API_KEY: process.env.THIRDWEB_API_KEY,
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
    public: {
      nftchainId: 5,
      nftchain: 'goerli',
      nftcontract: process.env.ETH_CONTRACT
    }
  },
  vite: {
    plugins: [nodePolyfills()]
  },
  build: (() => {
    if (process.env.NODE_ENV == 'production') {
      return { transpile: ['ethers/lib/utils'] }
    } else {
      return {}
    }
  })()
})
