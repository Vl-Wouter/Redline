import Cookies from 'js-cookie'

export default function ({ store, app: { $axios } }) {
  const token = Cookies.get('token')
  if (token) {
    $axios.setToken(token, 'Bearer')
  }
}
