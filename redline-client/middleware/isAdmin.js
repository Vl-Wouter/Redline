export default function ({ store, redirect, from }) {
  const user = store.getters['user/getCurrent']
  if (!user.isAdmin) {
    return redirect(from)
  }
}
