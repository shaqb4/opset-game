// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-simple-robots',
    'nuxt-simple-sitemap',
    'nuxt-gtag'
  ],
  site: {
    url: 'https://opset.games',
  },
  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-8L1FE8DZT7'
  },
  colorMode: {
    preference: 'light', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
  routeRules: {
    '/**': {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin'
      }
    }
  },
  vite: {
    server: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
      }
    }
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ]
})