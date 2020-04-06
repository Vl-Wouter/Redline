<template>
  <div class="container">
    <alert v-if="error" type="error" @removeError="removeError">{{
      error.message
    }}</alert>
    <div v-else-if="events">
      <h2>Hi {{ user ? user.fullName : 'Guest' }}</h2>
      <div class="title__link">
        <p>Upcoming Events</p>
        <nuxt-link to="/events">View All</nuxt-link>
      </div>
      <main>
        <nuxt-link
          v-for="event in events"
          :key="event.id"
          :to="`/events/${event.slug}`"
        >
          <small-event-card :event="event" />
        </nuxt-link>
      </main>
    </div>
    <error-view v-if="!events && !loading" />
  </div>
</template>

<script>
import SmallEventCard from '~/components/cards/SmallEventCard'
import Alert from '~/components/Alert'
import ErrorView from '~/components/ErrorView'

export default {
  components: {
    SmallEventCard,
    Alert,
    ErrorView
  },
  data: () => ({
    error: null,
    loading: true
  }),
  computed: {
    user() {
      return this.$store.state.user.current
    }
  },
  async mounted() {
    try {
      const { data } = await this.$axios.get('/events')
      this.events = data
    } catch (error) {
      if (error.response) {
        this.error = error.response.data
      } else {
        this.error = error
      }
    } finally {
      this.loading = false
    }
  },
  methods: {
    removeError() {
      this.error = null
    }
  },
  head() {
    return {
      title: 'Redline | Car Community App'
    }
  }
}
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  padding: 16px 0 64px 0;
  min-height: 100%;
  /* display: flex;
  justify-content: center;
  align-items: center;
  text-align: center; */
}

a {
  text-decoration: none;
  color: app-color('primary');
  font-weight: 700;
}

.title__link {
  display: flex;
  justify-content: space-between;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
