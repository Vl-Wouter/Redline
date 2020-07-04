<template>
  <main class="container mx-auto">
    <section v-if="events.length > 0"></section>
    <section v-else>
      <p class="text-center text-gray-500 px-2">
        There are no upcoming events.
        <span v-if="user"
          >Why don't you
          <nuxt-link to="/new" class="text-redline-light"
            >create one?</nuxt-link
          ></span
        >
      </p>
    </section>
  </main>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'app',
  asyncData(context) {
    return axios.get('/api/events').then((res) => {
      return {
        events: res.data,
      }
    })
  },
  data() {
    return {
      events: null,
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
  },
}
</script>
