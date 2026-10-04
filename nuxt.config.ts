// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'nuxt-auth-utils',
    '@nuxthub/core'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },

  ogImage: {
    zeroRuntime: true
  },

  runtimeConfig: {
    resendApiKey: '',
    mailFrom: 'Tides Up <onboarding@resend.dev>',
    public: {
      siteUrl: ''
    },
    session: {
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }
  },

  hub: {
    db: 'sqlite'
  }
})
