<template>
  <div>
    <section
      id="lightbox"
      class="fixed hidden top-0 z-40 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center"
    >
      <button
        @click="closeModal('lightbox')"
        class="absolute top-0 right-0 mr-4 mt-4 text-2xl text-white"
      >
        <font-awesome-icon icon="times" />
      </button>
      <div class="h-3/4 lg:h-full lg:w-3/4">
        <img
          v-if="activePhoto"
          :src="`/api/img/${activePhoto.url}`"
          :alt="activePhoto.alt"
          class="h-full w-full object-contain"
        />
      </div>
    </section>
    <modal id="delete-modal" class="hidden">
      <h2 class="font-bold">Delete {{ album.title }}?</h2>
      <div class="flex justify-between items-center mt-4">
        <button
          class="px-4 py-2 bg-red-600 border border-red-600 text-white rounded"
          @click="deleteAlbum"
        >
          <font-awesome-icon icon="trash" /> Delete
        </button>
        <button
          class="px-4 py-2 border border-rl-blue text-rl-blue rounded"
          @click="closeModal('delete-modal')"
        >
          Cancel
        </button>
      </div>
    </modal>
    <main class="container mx-auto lg:w-1/2">
      <header class="relative w-full h-48 lg:rounded overflow-hidden">
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
      <section
        v-if="user && (isOwn || user.isAdmin)"
        class="w-full px-2 mt-4 flex justify-between items-center"
      >
        <nuxt-link
          to="edit"
          append
          class="px-2 py-2 rounded border border-redline text-redline"
          ><font-awesome-icon icon="edit" /> Edit</nuxt-link
        >
        <button
          class="px-2 py-2 rounded bg-red-600 text-white border border-red-600"
          @click="showModal('delete-modal')"
        >
          <font-awesome-icon icon="trash" />
          Delete
        </button>
      </section>
      <main class="px-2 grid grid-cols-2 gap-4 my-4">
        <div
          v-for="photo in album.photos"
          :key="photo.id"
          class="w-full h-40 rounded overflow-hidden cursor-pointer"
          @click="openLightbox(photo)"
        >
          <img
            :src="`/api/img/${photo.url}`"
            :alt="photo.alt"
            class="w-full h-full object-cover"
          />
        </div>
      </main>
      <section class="w-full" v-if="user">
        <nuxt-link
          :to="`/report?url=${$route.fullPath}&type=event`"
          class="block text-center w-full py-2 text-redline font-bold"
        >
          Report "{{ album.title }}"
        </nuxt-link>
      </section>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import Modal from '~/components/Modal'
export default {
  layout: 'app',
  components: {
    Modal,
  },
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
      activePhoto: null,
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
    isOwn() {
      return this.album.photographer.id === this.user.id
    },
  },
  methods: {
    showModal(id) {
      document.querySelector(`#${id}`).classList.remove('hidden')
    },
    closeModal(id) {
      document.querySelector(`#${id}`).classList.add('hidden')
    },
    openLightbox(photo) {
      this.activePhoto = photo
      this.showModal('lightbox')
    },
    async deleteAlbum() {
      try {
        await this.$axios.delete(`/api/albums/${this.album.id}`)
        this.$toast.success('Album has been deleted')
        return this.$router.push('/albums')
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
        this.closeModal('delete-modal')
      }
    },
  },
}
</script>
