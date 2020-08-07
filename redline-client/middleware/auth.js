import Cookies from 'js-cookie'

export default function ({ store, redirect, app: { $axios } }) {
  const token = Cookies.get('token')
  if (!store.state.user.current || !token) {
    store.dispatch('user/signOut')
    return redirect('/login')
  }
  $axios.setToken(token, 'Bearer')
}
