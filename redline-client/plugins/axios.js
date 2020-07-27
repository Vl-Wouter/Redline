import Cookies from 'js-cookie'

export default function ({ $axios, redirect }) {
  const token = Cookies.get('token')
  console.log('token', token)
  $axios.onRequest((config) => {
    console.log(config.headers)
    // if (!config.headers.Authorization) {
    //   config.headers.Authorization = token
    //   console.log(config.headers)
    // }
  })
}
