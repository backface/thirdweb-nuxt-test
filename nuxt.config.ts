// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    ETH_PRIVATE_KEY: process.env.ETH_PRIVATE_KEY,
    public: {
      nftchain: 5,
      nftcontract: process.env.ETH_CONTRACT
    }
  },
  vite: {
    plugins: [nodePolyfills()]
  }
})