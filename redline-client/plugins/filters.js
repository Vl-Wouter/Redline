import Vue from 'vue'

Vue.filter('eventDate', (value, format) => {
  const date = new Date(value)
  return date.toLocaleDateString(
    'en',
    format ?? {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )
})

Vue.filter('localeTime', (value, format) => {
  const date = new Date(value)
  return date.toLocaleTimeString(
    'en',
    format ?? { hour12: false, hour: '2-digit', minute: '2-digit' }
  )
})
