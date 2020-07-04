<template>
  <div>{{ event }}</div>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'app',
  asyncData({ params }) {
    return axios.get(`/api/events/${params.slug}`).then((res) => {
      return {
        event: res.data,
      }
    })
  },
  data() {
    return {
      event: null,
    }
  },
}
</script>
