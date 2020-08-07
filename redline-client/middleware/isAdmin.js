export default function ({ store, redirect, from }) {
  const user = store.getters['user/getCurrent']
  console.log(user.isAdmin)
  if (!user.isAdmin) {
    return redirect(from)
  }
}
