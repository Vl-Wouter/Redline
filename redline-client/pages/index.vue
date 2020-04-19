<template>
  <main class="container">
    <header>
      <h2>Hello {{ user ? user.fullName : 'Guest' }}</h2>
    </header>
    <main>
      <section class="upcoming">
        <header class="title__link">
          <p>Upcoming events</p>
          <nuxt-link to="/events">View All</nuxt-link>
        </header>
        <main class="event__grid">
          <square-event-card
            v-for="event in events"
            :key="event.id"
            :event="event"
          />
        </main>
      </section>
    </main>
  </main>
</template>

<script>
import SquareEventCard from '~/components/cards/SquareEventCard'
export default {
  middleware: 'events',
  components: {
    SquareEventCard
  },
  data: () => ({
    error: null,
    loading: true
  }),
  computed: {
    user() {
      return this.$store.state.user.current
    },
    events() {
      return this.$store.getters['events/getAll'].slice(0, 6)
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
}

a {
  text-decoration: none;
  color: app-color('primary');
  font-weight: 700;
}

.unicon {
  fill: currentColor;
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

.event__grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 8px));
  grid-template-rows: auto;
  gap: 16px;
}
</style>
