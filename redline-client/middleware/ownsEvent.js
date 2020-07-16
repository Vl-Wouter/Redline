import axios from 'axios'

export default async function ({ store, redirect, from, params }) {
  const { data } = await axios.get(`/api/events/${params.slug}`)
  if (data.organiser.id !== store.state.user.current.id) {
    return redirect(from)
  }
}
