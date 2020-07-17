<template>
  <main class="container mx-auto mt-2 lg:grid lg:grid-cols-4 gap-4">
    <section v-if="eventCount > 0" class="px-2 lg:col-span-3">
      <section v-for="(eventList, month) in filterEvents" :key="month">
        <h2 class="text-lg font-bold lg:text-center">{{ month }}</h2>
        <main class="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4">
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
    <section v-else class="lg:col-span-3 lg:col-start-1">
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
    <section
      class="absolute z-20 hidden overflow-visible lg:block lg:h-auto lg:z-0 w-full h-screen top-0 left-0 lg:relative bg-white lg:rounded lg:border px-4 py-2"
      id="filters"
    >
      <header class="w-full flex justify-between items-center">
        <h2 class="text-xl font-bold">Filters</h2>
        <button @click="hideFilters" class="text-redline text-xl lg:hidden">
          <font-awesome-icon icon="times" />
        </button>
      </header>
      <main class="w-full">
        <form class="my-4 space-y-2">
          <input
            v-model="filters.search"
            type="text"
            name="search"
            id="search"
            placeholder="Search..."
            class="border rounded w-full px-4 py-2 focus:outline-none focus:border-redline"
          />
          <h3 class="text-redline">Categories</h3>
          <select
            v-model="filters.type"
            name="category"
            multiple
            id="category"
            class="w-full rounded border h-auto focus:outline-none focus:border-redline"
          >
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
              class="px-4 py-2 odd:bg-gray-100"
              >{{ category.name }}</option
            >
          </select>
          <h3 class="text-redline">Distance</h3>
          <div
            class="flex flex-row justify-between border rounded overflow-hidden items-center focus-within:border-redline"
          >
            <input
              v-model="filters.distance.min"
              type="number"
              name="distMin"
              id="distMin"
              class="w-1/3 py-2 px-2 bg-gray-100 focus:outline-none"
            />
            <span class="font-bold">-</span>
            <input
              v-model="filters.distance.max"
              type="number"
              name="distMax"
              class="w-1/3 py-2 px-2 bg-gray-100 focus:outline-none"
              id="distMax"
            />
          </div>
          <h3 class="text-redline">Dates</h3>
          <div>
            <label for="startDate" class="block">From</label>
            <input
              v-model="filters.date.start"
              type="date"
              name="startDate"
              id="startDate"
              class="w-full py-2 px-4 rounded border focus:outline-none focus:border-redline"
            />
          </div>
          <div>
            <label for="endDate" class="block">To</label>
            <input
              v-model="filters.date.end"
              type="date"
              name="endDate"
              id="endDate"
              class="w-full py-2 px-4 rounded border focus:outline-none focus:border-redline"
            />
          </div>
        </form>
        <button
          @click="clearFilters"
          class="bg-redline w-full rounded py-2 text-white"
        >
          Clear filters
        </button>
      </main>
    </section>
    <button
      @click="showFilters"
      class="fixed z-10 lg:hidden right-0 bottom-0 mb-4 mr-4 shadow-md rounded-full h-12 w-12 bg-rl-blue text-white flex justify-center items-center"
    >
      <font-awesome-icon icon="filter" class="block" />
    </button>
  </main>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'app',
  components: {},
  asyncData(context) {
    return axios
      .all([axios.get(`/api/events`), axios.get('/api/categories')])
      .then(
        axios.spread((...res) => {
          return {
            events: res[0].data,
            categories: res[1].data,
          }
        })
      )
  },
  data() {
    return {
      events: null,
      filters: {
        search: null,
        distance: {
          max: null,
          min: null,
        },
        type: [],
        date: {
          start: null,
          end: null,
        },
      },
      categories: null,
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
    filterEvents() {
      const { search, type, distance, date } = this.filters
      let events = this.events
      if (search) {
        events = events.filter((event) => {
          return (
            event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.description.toLowerCase().includes(search.toLowerCase())
          )
        })
      }
      if (type.length > 0) {
        events = events.filter((event) => type.includes(event.__category__.id))
      }
      if (distance.min) {
        events = events.filter(
          (event) => parseInt(event.distance) > parseInt(distance.min)
        )
      }
      if (distance.max) {
        events = events.filter(
          (event) => parseInt(event.distance) < parseInt(distance.max)
        )
      }
      if (date.start) {
        events = events.filter(
          (event) =>
            new Date(event.startTime).getTime() >=
            new Date(date.start).getTime()
        )
      }
      if (date.end) {
        const end = new Date(date.end)
        end.setDate(end.getDate() + 1)
        events = events.filter(
          (event) => new Date(event.endTime).getTime() <= end.getTime()
        )
      }
      return this.groupEvents(events)
    },
    eventCount() {
      return Object.keys(this.filterEvents).length
    },
  },
  async created() {
    const filters = this.$store.getters['events/getFilters']
    this.filters = JSON.parse(JSON.stringify(filters)) // Deep clone to apply filters
    const { coords } = await this.$position()
    const events = []
    this.events.forEach((event) => {
      event.distance = this.$distance(
        coords.latitude,
        coords.longitude,
        event.latitude,
        event.longitude
      ).toFixed(0)
      events.push(event)
    })
    this.events = events
  },
  methods: {
    showFilters() {
      document.querySelector('#filters').classList.remove('hidden')
    },
    hideFilters() {
      document.querySelector('#filters').classList.add('hidden')
    },
    clearFilters() {
      this.$store.dispatch('events/clearFilters')
      this.filters = JSON.parse(
        JSON.stringify(this.$store.getters['events/getFilters'])
      )
    },
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
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('events/applyFilters', this.filters)
    next()
  },
}
</script>
