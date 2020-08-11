<template>
  <main class="container mx-auto px-2 lg:w-3/4">
    <h1 class="lg:text-center text-xl font-bold mb-2">Recent albums</h1>
    <section v-if="albums" class="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
      <nuxt-link
        v-for="album in albums"
        :key="album.id"
        :to="`/albums/${album.slug}`"
        class="w-full h-40 bg-gray-400 rounded border relative overflow-hidden"
      >
        <img
          :src="`/api/img/${album.photos[0].url}`"
          :alt="album.title"
          class="w-full h-full object-cover"
        />
        <section
          class="absolute top-0 left-0 w-full h-full px-2 bg-black bg-opacity-50 text-white flex flex-col items-center justify-center"
        >
          <p class="font-bold">{{ album.title }}</p>
          <p class="text-xs">
            {{ album.photographer.firstName }} {{ album.photographer.lastName }}
          </p>
        </section>
      </nuxt-link>
    </section>
    <section v-else class="w-full text-center">
      <p class="text-gray-700">There are no albums.</p>
    </section>
    <nuxt-link
      v-if="user"
      to="/new"
      class="fixed z-top right-0 bottom-0 mb-4 mr-4 shadow-md rounded-full h-12 w-12 bg-rl-blue text-white flex justify-center items-center"
      ><font-awesome-icon icon="plus" class="block"
    /></nuxt-link>
  </main>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'app',
  asyncData() {
    return axios.get('/api/albums').then((res) => ({
      albums: res.data,
    }))
  },
  data() {
    return {
      albums: null,
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
  },
}
</script>
