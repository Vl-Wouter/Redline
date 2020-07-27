<template>
  <div>
    <modal id="delete-modal" class="hidden">
      <h2 class="font-bold">Delete {{ album.title }}?</h2>
      <div class="flex justify-between items-center">
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
