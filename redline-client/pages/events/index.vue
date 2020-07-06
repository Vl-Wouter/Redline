<template>
  <main class="container mx-auto mt-2">
    <section v-if="events.length > 0" class="px-2">
      <section v-for="(eventList, month) in filterEvents" :key="month">
        <h2 class="text-lg font-bold lg:text-center">{{ month }}</h2>
        <main class="grid grid-cols-1 lg:grid-cols-4 gap-4 my-4">
          <nuxt-link
            v-for="event in eventList"
            :key="event.id"
            :to="`/events/${event.slug}`"
            class="bg-white rounded px-2 py-2 border flex flex-row justify-between items-center space-x-4"
          >
            <div
              class="w-12 h-12 rounded bg-gray-400 overflow-hidden shadow-sm"
            >
              <img
                :src="`/api/img/${event.header}`"
                :alt="event.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 class="font-bold text-redline">{{ event.title }}</h3>
              <p class="text-xs text-gray-700">
                {{ event.startTime | eventDate }}
              </p>
            </div>
            <div>
              <div class="w-12 h-12">
                <button class="w-full h-full">NAV</button>
              </div>
            </div>
          </nuxt-link>
        </main>
      </section>
    </section>
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
    filterEvents(filters) {
      return this.groupEvents(this.events)
    },
  },
  methods: {
    groupEvents(events) {
      return events.reduce((r, a) => {
        r[
          new Date(a.startTime).toLocaleString(undefined, {
            month: 'long',
            year: 'numeric',
          })
        ] = [
          ...(r[
            new Date(a.startTime).toLocaleString(undefined, {
              month: 'long',
              year: 'numeric',
            })
          ] || []),
          a,
        ]
        return r
      }, {})
    },
  },
}
</script>
