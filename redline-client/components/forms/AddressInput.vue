<template>
  <section>
    <text-input
      input-type="text"
      @blur.native="processAddress($event.target.value)"
    />
    <Map v-if="hasMap" :center="mapCenter" class="map" />
  </section>
</template>

<script>
import Map from '../Map'
import TextInput from './TextInput'
export default {
  props: {
    hasMap: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  components: {
    TextInput,
    Map
  },
  data: () => ({
    location: {
      address: '',
      longitude: 0,
      latitude: 0
    }
  }),
  computed: {
    mapCenter() {
      const { longitude, latitude } = this.location
      return longitude && latitude
        ? [longitude, latitude]
        : [4.35142, 50.849068]
    }
  },
  methods: {
    async processAddress(addressString) {
      if (addressString) {
        try {
          const { data } = await this.$axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${addressString}.json?access_token=${process.env.MAPBOX_KEY}`
          )

          const location = data.features[0]
          this.location = {
            address: location.place_name,
            longitude: location.center[0],
            latitude: location.center[1]
          }

          this.$emit('processed', this.location)
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  margin: 16px 0;
  margin-left: -16px;
  position: relative;
}
</style>
