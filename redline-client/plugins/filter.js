import Vue from 'vue'

Vue.filter('localDateTime', (input) => {
  const date = new Date(input)
  const dateString = date.toLocaleString('nl-BE', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return dateString
})

Vue.filter('localDate', (input) => {
  const date = new Date(input)
  const dateString = date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  return dateString
})

Vue.filter('localTime', (input) => {
  const date = new Date(input)
  const timeString = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return timeString
})

Vue.filter('toEUR', (input, locale = undefined) => {
  if (isNaN(input)) return null
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR'
  }).format(input)
})

Vue.filter('fullName', (input) => {
  if (!input.firstName || !input.lastName) return null
  return `${input.firstName} ${input.lastName}`
})
