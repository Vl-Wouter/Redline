const toRad = (value) => {
  return (value * Math.PI) / 180
}

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

const getPosition = (options) => {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export default (context, inject) => {
  inject('distance', calcCrow)
  inject('position', getPosition)
}
