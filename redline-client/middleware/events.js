export default async function({ store }) {
  const { lastFetch } = store.state.events
  const minutesSinceFetch = Math.floor((Date.now() - lastFetch) / 1000 / 60)
  if (minutesSinceFetch > 15) {
    await store.dispatch('events/fetchEvents')
    await store.dispatch('events/fetchCategories')
  }
}
