<template>
  <div id="mapContainer" class="map"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
export default {
  props: {
    center: {
      type: Array,
      default() {
        return [4.35142, 50.849068]
      }
    },
    fill: Boolean
  },
  data: () => ({
    map: null,
    marker: null
  }),
  watch: {
    center: {
      immediate: true,
      handler(val, oldVal) {
        if (!this.map) return
        this.map.flyTo({
          center: val,
          speed: 0.8,
          zoom: 13,
          essential: true
        })
        this.marker.remove()
        this.marker = new mapboxgl.Marker().setLngLat(val).addTo(this.map)
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      mapboxgl.accessToken = process.env.MAPBOX_KEY
      this.map = new mapboxgl.Map({
        container: 'mapContainer',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.center,
        zoom: 13,
        interactive: false
      })
      this.marker = new mapboxgl.Marker().setLngLat(this.center).addTo(this.map)
    })
  }
}
</script>

<style lang="scss" scoped></style>
