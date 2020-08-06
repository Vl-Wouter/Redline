<template>
  <main class="container mx-auto px-2 mt-2">
    <nuxt-link
      class="font-bold text-redline"
      :to="`/user/${user.username}/settings`"
      ><font-awesome-icon icon="arrow-left" /> Go Back</nuxt-link
    >
    <h1 class="mb-4 font-bold text-xl">Reports</h1>
  </main>
</template>

<script>
import axios from 'axios'
export default {
  middleware: ['auth', 'isAdmin'],
  asyncData() {
    return axios
      .get('/api/reports')
      .then((res) => {
        return {
          reports: res.data,
        }
      })
      .catch((err) => console.log(err))
  },
  data() {
    return {
      reports: null,
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
  },
}
</script>
