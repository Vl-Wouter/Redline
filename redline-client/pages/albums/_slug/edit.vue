<template>
  <main class="container mx-auto px-2 mt-4">
    <nuxt-link :to="`/albums/${album.slug}`" class="font-bold text-redline"
      ><font-awesome-icon icon="arrow-left" /> Back
    </nuxt-link>
    <h1 class="text-xl font-bold">Edit Album</h1>
    <form @submit.prevent="submit" method="post">
      <f-group label="Album title" field="title">
        <input v-model="form.title" type="text" name="title" id="title" />
      </f-group>
      <f-group label="Description" field="desc">
        <textarea
          v-model="form.description"
          name="desc"
          id="desc"
          cols="30"
          rows="5"
        ></textarea>
      </f-group>
      <f-group
        label="Add Photos"
        field="photos"
        helper="Add new photos to the album"
      >
        <file-input
          name="photos"
          @files="
            (fileData) => {
              addPhotos(fileData)
            }
          "
          allow-multiple
          label-text
        ></file-input>
      </f-group>
      <div class="grid grid-cols-2 gap-4 my-4">
        <div
          v-for="photo in album.photos"
          :key="photo.id"
          class="relative rounded overflow-hidden"
        >
          <button
            @click.prevent="deletePhoto(photo.id)"
            class="rounded-full px-2 py-1 bg-red-600 text-white absolute top-0 right-0 mr-2 mt-2 shadow-sm"
          >
            <font-awesome-icon icon="trash" />
          </button>
          <img
            :src="`/api/img/${photo.url}`"
            :alt="photo.alt"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
      <button type="submit" class="w-full py-2 rounded text-white bg-redline">
        Edit event
      </button>
    </form>
  </main>
</template>

<script>
import axios from 'axios'
import ContentFormGroup from '~/components/ContentFormGroup'
import FileInput from '~/components/FileInput'
export default {
  middleware: ['auth'],
  components: {
    'f-group': ContentFormGroup,
    FileInput,
  },
  asyncData({ params }) {
    return axios.get(`/api/albums/${params.slug}`).then(({ data }) => ({
      album: data,
      form: {
        title: data.title,
        description: data.description,
      },
    }))
  },
  data() {
    return {
      album: null,
      form: null,
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
    async submit() {
      try {
        const data = this.$toFormData(this.form)
        console.log(data, this.form)
        await this.$axios.patch(`/api/albums/${this.album.id}`, data)
        return this.$router.push(`/albums/${this.album.slug}`)
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
    async deletePhoto(id) {
      try {
        await this.$axios.delete(`/api/albums/photo/${id}`)
        this.album.photos = this.album.photos.filter((photo) => photo.id !== id)
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
    async addPhotos(photos) {
      try {
        console.log('Input', photos)
        const formData = new FormData()
        for (let i = 0; i < photos.length; i++) {
          const file = photos[i]
          if (!file.type.match('image.*')) continue
          formData.append('photos', file)
        }
        console.log('Photos', formData.get('photos'))
        const { data } = await this.$axios.post(
          `/api/albums/${this.album.id}/photo`,
          formData
        )
        console.log(data)
        // this.album = data
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.user.id !== vm.album.photographer.id && !vm.user.isAdmin) {
        return vm.$router.push(from)
      }
    })
  },
}
</script>
