/**
 * Convert number to radial
 * @param {Number} value
 */
const toRad = (value) => {
  return (value * Math.PI) / 180
}

/**
 * Calculate the distance between two sets of coordinates
 * @param {Number} lat1 Latitude of first position
 * @param {Number} lng1 Longitude of first position
 * @param {Number} lat2 Latitude of second position
 * @param {Number} lng2 Longitude of second position
 */
const calcCrow = (lat1, lng1, lat2, lng2) => {
  const r = 6371 // KM
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const rLat1 = toRad(lat1)
  const rLat2 = toRad(lat2)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(rLat1) * Math.cos(rLat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = r * c
  return d
}

/**
 * Get the users location using the GeoLocation API
 * @param {*} options
 */
const getPosition = (options) => {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

const toFormData = (object) => {
  const formData = new FormData()
  for (const key in object) {
    formData.append(key, object[key])
  }
  return formData
}

// const error = (error, options) => {
//   if (error.response) {
//     error.reponse.data.message.forEach((message) => {
//       Vue.toasted.error(message, {
//         duration: 2000,
//         keepOnHover: true,
//       })
//     })
//   } else {
//     Vue.toasted.error(error.message, {
//       duration: 2000,
//       keepOnHover: true,
//     })
//   }
// }

// const success = (message) => {
//   Vue.toasted.success(message, {})
// }

export default (context, inject) => {
  inject('distance', calcCrow)
  inject('position', getPosition)
  inject('toFormData', toFormData)
}
