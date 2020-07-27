import Cookies from 'js-cookie'

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/vue-ctk-datetime.js',
    '~/plugins/filters.js',
    '~/plugins/helpers.js',
    '~/plugins/moment.js',
    // '~/plugins/axios.js',
    { src: '~/plugins/v-calendar.js', ssr: false },
    { src: '~/plugins/vuex-persist.js', ssr: false },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/fontawesome',
    'nuxt-leaflet',
    '@nuxtjs/toast',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
  },

  proxy: {
    '/api/': 'http://localhost:4000',
  },

  fontawesome: {
    icons: {
      solid: [
        'faHome',
        'faStream',
        'faMap',
        'faArrowLeft',
        'faPlus',
        'faCalendar',
        'faImages',
        'faNewspaper',
        'faEnvelope',
        'faLock',
        'faCamera',
        'faCar',
        'faCalendarPlus',
        'faUpload',
        'faUser',
        'faCog',
        'faTimes',
        'faCheck',
        'faTrash',
        'faPlusCircle',
        'faGavel',
        'faEdit',
        'faFilter',
        'faSignInAlt',
        'faSignOutAlt',
        'faEllipsisH',
      ],
      brands: ['faFontAwesome'],
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
}
