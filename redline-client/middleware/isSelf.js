export default function({ store, params, redirect }) {
  if (
    !store.state.user.current ||
    store.state.user.current.username !== params.username
  ) {
    return redirect('/')
  }
}
