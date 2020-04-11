export default function({ store, params, redirect }) {
  const event = store.getters['events/getBySlug'](params.slug)
  if (store.state.user.current.id !== event.organiser.id) redirect('/login')
}
