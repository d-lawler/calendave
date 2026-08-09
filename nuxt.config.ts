export default defineNuxtConfig({
  compatibilityDate: '2026-08-09',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'DAVECAL — leftfield London',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'A personal radar for offbeat London: experimental music, repertory cinema, art, and odd happenings.'
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap'
        }
      ]
    }
  },
  nitro: {
    preset: 'static'
  }
})
