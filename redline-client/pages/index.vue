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
    <section v-if="events.length > 0">
      <h2 class="font-bold lg:text-center my-2">Upcoming events</h2>
      <main class="grid grid-cols-2 lg:grid-cols-6 gap-2">
        <nuxt-link
          v-for="event in events"
          :key="event.id"
          :to="`/events/${event.slug}`"
        >
          <div class="square rounded overflow-hidden border">
            <div class="content">
              <img
                :src="`http://localhost:4000/api/img/${event.header}`"
                :alt="event.title"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute bottom-0 w-full bg-white bg-opacity-75 px-2 py-2"
              >
                <p>{{ event.title }}</p>
              </div>
            </div>
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
      class="fixed z-top right-0 bottom-0 mb-4 mr-4 shadow-md rounded-full h-12 w-12 bg-redline-light flex justify-center items-center"
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
  },
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.square {
  position: relative;
  padding-bottom: 100%;
  width: 100%;
}

.content {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
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
