import Vue from 'vue'
import moment from 'moment'
// Filters

Vue.filter('eventDate', (value, format) => {
  const date = new Date(value)
  return date.toLocaleDateString(
    'en-GB',
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
    'en-GB',
    format ?? { hour12: false, hour: '2-digit', minute: '2-digit' }
  )
})

Vue.filter('timeTo', (value) => {
  const date = moment(new Date(value))
  return date.fromNow()
})
