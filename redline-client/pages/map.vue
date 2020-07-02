<template>
  <div class="h-screen w-full bg-redline">
    <client-only>
      <l-map
        :zoom="11"
        :center="
          location
            ? [location.coords.latitude, location.coords.longitude]
            : [50.849828, 4.351767]
        "
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <l-marker
          v-for="event in events"
          :key="event.id"
          :lat-lng="[event.latitude, event.longitude]"
        >
          <l-popup>
            <h1>{{ event.title }}</h1>
            <p>{{ event.address }}</p>
          </l-popup>
        </l-marker>
      </l-map>
    </client-only>
    <nuxt-link
      to="/"
      class="fixed z-top left-0 bottom-0 mb-4 ml-4 rounded-full h-12 w-12 bg-white shadow-md flex justify-center items-center"
      ><font-awesome-icon icon="arrow-left" class="block"
    /></nuxt-link>
    <nuxt-link
      v-if="user"
      to="/new"
      class="fixed z-top right-0 bottom-0 mb-4 mr-4 shadow-md rounded-full h-12 w-12 bg-redline-light flex justify-center items-center"
      ><font-awesome-icon icon="plus" class="block"
    /></nuxt-link>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'default',
  asyncData(context) {
    return axios.get('/api/events').then((res) => {
      return {
        events: res.data,
      }
    })
  },
  data() {
    return {
      location: null,
      events: null,
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
  },
  created() {
    if (!('geolocation' in navigator)) {
      this.$toast.show('Using default location')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.location = pos
      },
      (err) => {
        this.$toast.error(err.message)
      }
    )
  },
}
</script>

<style lang="scss" scoped>
.z-top {
  z-index: 999;
}
</style>
