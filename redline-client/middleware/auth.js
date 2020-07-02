export default function ({ store, redirect }) {
  if (!store.state.user.current) {
    return redirect('/login')
  }
}
