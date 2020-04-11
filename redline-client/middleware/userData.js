export default async function({ store }) {
  if (!store.state.user.settingsData) {
    await store.dispatch('user/getUserData')
  }
}
