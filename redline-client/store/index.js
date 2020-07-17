import VuexPersistence from 'vuex-persist'
import Cookies from 'js-cookie'
// const vuexLocal = new VuexPersistence({
//   key: 'vuex',
//   storage: window.localStorage,
// })

const vuexCookie = new VuexPersistence({
  restoreState: (key, storage) => Cookies.getJSON(key),
  saveState: (key, state, storage) =>
    Cookies.set(key, state, {
      expires: 1,
    }),
  modules: ['user'],
})

export const plugins = [vuexCookie.plugin]
