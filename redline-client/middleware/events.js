export default async function({ store }) {
  await store.dispatch('events/fetchEvents')
  await store.dispatch('events/fetchCategories')
}
