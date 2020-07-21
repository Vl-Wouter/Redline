<template>
  <main class="container mx-auto">
    <header class="relative w-full h-48">
      <img
        :src="`/api/img/${album.photos[0].url}`"
        :alt="album.title"
        class="w-full h-full object-cover"
      />
      <section
        class="w-full h-full absolute top-0 left-0 bg-black bg-opacity-75 text-white flex flex-col items-center justify-center"
      >
        <h1 class="text-xl font-bold">{{ album.title }}</h1>
        <p>{{ album.description }}</p>
        <p class="text-sm">
          By:
          <nuxt-link
            :to="`/user/${album.photographer.username}`"
            class="text-redline-light"
            >{{ album.photographer.firstName }}
            {{ album.photographer.lastName }}</nuxt-link
          >
        </p>
      </section>
    </header>
    <main class="px-2 grid grid-cols-2 gap-4 my-4">
      <div
        v-for="photo in album.photos"
        :key="photo.id"
        class="w-full h-40 rounded overflow-hidden"
      >
        <img
          :src="`/api/img/${photo.url}`"
          :alt="photo.alt"
          class="w-full h-full object-cover"
        />
      </div>
    </main>
  </main>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'app',
  asyncData({ params }) {
    return axios.get(`/api/albums/${params.slug}`).then((res) => {
      return {
        album: res.data,
      }
    })
  },
  data() {
    return {
      album: null,
    }
  },
}
</script>
