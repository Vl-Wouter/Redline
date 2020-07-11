<template>
  <main class="container mx-auto"></main>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'app',
  middleware: 'auth',
  asyncData(context) {
    return axios.get('/api/feeds').then((res) => {
      return {
        activities: res.data,
      }
    })
  },
  data() {
    return {
      activities: null,
    }
  },
}
</script>
