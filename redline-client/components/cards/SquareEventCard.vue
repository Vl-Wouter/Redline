<template>
  <nuxt-link :to="`/events/${event.slug}`">
    <card class="event__card">
      <img :src="`${apiURL}/events/header/${event.header}`" :alt="event.slug" />
      <main class="event__card__content">
        <h3>{{ event.title }}</h3>
        <p>{{ event.startTime | localDate }}</p>
      </main>
    </card>
  </nuxt-link>
</template>

<script>
import Card from './Card'
export default {
  data: () => ({
    apiURL: `http://${process.env.API_HOST}:${process.env.API_PORT}/api`
  }),
  props: {
    event: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    Card
  }
}
</script>

<style lang="scss" scoped>
div.card.event__card {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .event__card__content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #00000080;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-end;
    padding: 8px;
    color: app-color('background');
  }
}
</style>
