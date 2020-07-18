export default function ({ store, redirect, from }) {
  const { roles } = store.state.user.current
  if (!roles.includes('ADMIN') || !roles.includes('MODERATOR')) {
    return redirect(from)
  }
}
