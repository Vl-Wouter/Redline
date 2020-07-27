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
      <button type="submit" class="w-full py-2 rounded text-white bg-redline">
        Edit event
      </button>
    </form>
  </main>
</template>

<script>
import axios from 'axios'
import ContentFormGroup from '~/components/ContentFormGroup'
export default {
  middleware: ['auth'],
  components: {
    'f-group': ContentFormGroup,
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
