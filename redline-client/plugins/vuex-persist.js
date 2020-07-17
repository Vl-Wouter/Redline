import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      storage: window.localStorage,
      reducer: (state) => ({ user: state.user }),
      filter: (mutation) =>
        mutation.type === 'setUser' || mutation.type === 'setToken',
    }).plugin(store)
  })
}
