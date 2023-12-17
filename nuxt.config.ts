// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/robots'
  ],
  robots: {
    /* module options */
  },
  colorMode: {
    preference: 'light', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
  routeRules: {
    '/': {
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
  }
})
