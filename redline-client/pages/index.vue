<template>
  <div class="container mx-auto px-2">
    <modal v-if="user && user.vehicles.length < 1 && from === 'login'">
      <h2 class="font-bold">You don't have any vehicles</h2>
      <p>
        Adding a vehicle to your profile will help others to find out what cars
        are attending an event.
      </p>
      <nuxt-link
        to="/new/vehicle"
        class="block w-full py-2 rounded text-center bg-redline text-white"
        >Add a vehicle</nuxt-link
      >
    </modal>
    <modal id="geolocation-prompt" class="text-center">
      <h2 class="font-bold text-xl text-redline">Use my location? Why?</h2>
      <p class="my-2">
        We know you don't like to give away your location. And for us, privacy
        is a concern as well. At Redline, the only reason your geolocation is
        used is to calculate the distance from you to an event. This data is not
        saved anywhere, as these calculations happen on your own device.
      </p>
      <p>
        You can choose if you want to allow this or not, this popup will
        disappear once you made your choice.
      </p>
    </modal>
    <section v-if="user" class="lg:w-1/2 lg:mx-auto">
      <h2 class="font-bold text-lg lg:text-xl lg:text-center my-2">
        Your events
      </h2>
      <p
        v-if="
          events.length > 0 &&
          (!attendingEvents || attendingEvents.length === 0)
        "
        class="text-sm w-full text-center text-gray-700"
      >
        You aren't going to any events yet.
      </p>
      <div v-else class="flex flex-row overflow-auto w-full space-x-4">
        <nuxt-link
          v-for="event in attendingEvents"
          :key="event.id"
          :to="`/events/${event.slug}`"
          class="w-40 md:w-48 text-gray-800 flex-shrink-0 hover:text-redline"
        >
          <div class="square rounded overflow-hidden border">
            <div class="content">
              <img
                :src="`/api/img/${event.header}`"
                :alt="event.title"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h3 class="font-bold">{{ event.title }}</h3>
            <p class="text-sm text-gray-700">
              {{ event.startTime | timeTo }}
            </p>
          </div>
        </nuxt-link>
      </div>
    </section>
    <section v-if="events.length > 0">
      <h2 class="font-bold text-lg lg:text-xl lg:text-center my-2">
        Upcoming events
      </h2>
      <main class="grid grid-cols-2 lg:grid-cols-3 lg:w-1/2 lg:mx-auto gap-4">
        <nuxt-link
          v-for="event in events"
          :key="event.id"
          :to="`/events/${event.slug}`"
          class="hover:text-redline"
        >
          <div class="square rounded overflow-hidden border">
            <div class="content">
              <img
                :src="`/api/img/${event.header}`"
                :alt="event.title"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h3 class="font-bold">{{ event.title }}</h3>
            <p class="text-gray-700 text-sm">
              {{
                event.startTime
                  | eventDate({
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  })
              }}
              {{ event.distance && ` - ` + event.distance + ' km' }}
            </p>
          </div>
        </nuxt-link>
      </main>
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
    <nuxt-link
      v-if="user"
      to="/new"
      class="fixed z-top right-0 bottom-0 mb-4 mr-4 shadow-md rounded-full h-12 w-12 bg-rl-blue text-white flex justify-center items-center"
      ><font-awesome-icon icon="plus" class="block"
    /></nuxt-link>
  </div>
</template>

<script>
import axios from 'axios'
import Modal from '~/components/Modal'
export default {
  layout: 'app',
  components: {
    Modal,
  },
  asyncData(context) {
    return axios.get('/api/events').then((res) => {
      return {
        events: res.data,
        from: context.from.name,
      }
    })
  },
  data() {
    return {
      events: 'Hello',
      from: null,
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
    featuredEvents() {
      return this.events.slice(0, 6)
    },
    attendingEvents() {
      if (this.user) {
        let events = []
        this.events.forEach((event) => {
          if (
            event.attending.filter((item) => item.userId === this.user.id)
              .length > 0
          ) {
            events.push(event)
          }
        })
        events = events.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
        return events
      }
      return null
    },
  },
  async mounted() {
    try {
      // Calculate users distance from event
      const { coords } = await this.$position()
      document.querySelector('#geolocation-prompt').classList.add('hidden')
      if (coords) {
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
      }
    } catch (err) {
      this.error = err
    }
  },
  methods: {},
  head() {
    return {
      title: 'Redline | Local Car Events',
      meta: [
        {
          hid: 'home-desc',
          name: 'description',
          content: 'Find, create and share local car events easily on Redline.',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.square {
  position: relative;
  padding-bottom: 75%;
  width: 100%;
}

.content {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.card:hover {
  h3 {
    @apply text-redline;
  }
}

/* .container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
} */
</style>
