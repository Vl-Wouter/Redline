<template>
  <main class="container mx-auto px-2 lg:w-1/2">
    <section
      class="profile relative px-4 py-4 mt-8 bg-white w-full rounded border"
    >
      <div class="flex flex-col items-center">
        <nuxt-link
          v-if="isCurrent"
          to="settings"
          append
          class="absolute right-0 top-0 mr-4 mt-2 text-redline text-lg"
        >
          <font-awesome-icon icon="cog" />
        </nuxt-link>
        <section
          class="w-20 h-20 rounded-full bg-gray-400 overflow-hidden transform -translate-y-1/2 border-4 border-gray-100"
        >
          <img
            v-if="user.profileImg"
            :src="`/api/img/${user.profileImg}`"
            alt=""
          />
        </section>
        <section class="-mt-8 w-full text-gray-700">
          <h2 class="text-lg text-center text-redline">
            {{ user.firstName }} {{ user.lastName }}
          </h2>
          <div class="flex w-full flex-row justify-between">
            <p>{{ user.username }}</p>
            <p>{{ user.roles[0] }}</p>
          </div>
        </section>
      </div>
    </section>
    <section v-if="currentUser && !isCurrent" class="my-2 w-full">
      <button
        class="w-full py-2 bg-redline text-white rounded"
        @click="toggleFollow"
      >
        {{ isFollowing ? 'Unfollow' : 'Follow' }}
      </button>
    </section>
    <h2 class="mt-4 text-center font-bold">Vehicles</h2>
    <section class="w-full flex flex-row space-x-4 my-4">
      <nuxt-link v-if="isCurrent" to="/new/vehicle">
        <div
          class="h-32 w-32 lg:h-48 lg:w-48 bg-white rounded border text-center flex flex-col justify-center items-center space-y-4"
        >
          <font-awesome-icon icon="plus-circle" class="text-redline text-3xl" />
          <p class="text-gray-700">Add a new vehicle</p>
        </div>
      </nuxt-link>
      <div
        v-for="vehicle in user.vehicles"
        :key="vehicle.id"
        class="h-32 lg:h-48 w-32 lg:w-48 bg-white rounded border relative overflow-hidden"
      >
        <img
          :src="`/api/img/${vehicle.photo}`"
          :alt="`${vehicle.make} ${vehicle.model}`"
          class="w-full h-full object-cover"
        />
        <div class="absolute bottom-0 left-0 w-full bg-white">
          <p class="py-2 px-2 text-sm text-gray-700 text-center">
            {{ vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model }}
          </p>
        </div>
        <button
          v-if="currentUser && (isCurrent || currentUser.isAdmin)"
          @click="deleteVehicle(vehicle.id)"
          class="absolute top-0 right-0 mr-2 mt-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm"
        >
          <font-awesome-icon icon="trash" />
        </button>
      </div>
    </section>
    <section class="tabs mb-4">
      <header class="w-full flex flex-row justify-between my-4">
        <button
          class="flex-1 border-b rounded-t py-2 text-redline-light focus:outline-none"
          :class="activeTab === 'events' ? 'active__tab' : ''"
          @click="activeTab = 'events'"
        >
          Events
        </button>
        <button
          class="flex-1 border-b rounded-t py-2 text-redline-light focus:outline-none"
          :class="activeTab === 'albums' ? 'active__tab' : ''"
          @click="activeTab = 'albums'"
        >
          Albums
        </button>
        <button
          class="flex-1 border-b rounded-t py-2 text-redline-light focus:outline-none"
          :class="activeTab === 'articles' ? 'active__tab' : ''"
          @click="activeTab = 'articles'"
        >
          Articles
        </button>
      </header>
      <main
        v-if="activeTab === 'events'"
        class="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <nuxt-link
          v-for="event in user.ownEvents"
          :key="event.id"
          :to="`/events/${event.slug}`"
          class="w-full px-4 py-2 rounded bg-white border text-gray-700 text-sm"
        >
          <h2 class="text-lg text-redline font-bold">{{ event.title }}</h2>
          <p>{{ event.startTime | eventDate }}</p>
          <p class="text-xs">{{ event.address }}</p>
        </nuxt-link>
      </main>
      <main
        v-if="activeTab === 'albums'"
        class="grid grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <nuxt-link
          v-for="album in user.albums"
          :key="album.id"
          :to="`/albums/${album.slug}`"
          class="w-full h-40 bg-gray-400 rounded border relative overflow-hidden"
        >
          <img
            :src="`/api/img/${album.photos[0].url}`"
            :alt="album.title"
            class="w-full h-full object-cover"
          />
          <section
            class="absolute top-0 left-0 w-full h-full px-2 bg-black bg-opacity-50 text-white flex items-center justify-center"
          >
            <p class="font-bold">{{ album.title }}</p>
          </section>
        </nuxt-link>
      </main>
    </section>
  </main>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'app',
  middleware: 'token',
  asyncData({ params }) {
    return axios.get(`/api/users/${params.slug}`).then((res) => {
      return {
        user: res.data,
      }
    })
  },
  data() {
    return {
      user: null,
      activeTab: 'events',
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters['user/getCurrent']
    },
    isCurrent() {
      return (
        this.currentUser && this.currentUser.username === this.user.username
      )
    },
    isFollowing() {
      return (
        this.currentUser &&
        this.user.followed.filter((item) => {
          return item.follows.id === this.currentUser.id
        }).length > 0
      )
    },
  },
  mounted() {
    this.user.ownEvents.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
  },
  methods: {
    async deleteVehicle(id) {
      try {
        await this.$axios.delete(`/api/vehicles/${id}`)
        this.user.vehicles = this.user.vehicles.filter(
          (vehicle) => vehicle.id !== id
        )
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
    async toggleFollow() {
      try {
        if (this.isFollowing) {
          const { data } = await this.$axios.post(
            `/api/users/${this.user.id}/unfollow`
          )
          this.user = data
        } else {
          const { data } = await this.$axios.post(
            `/api/users/${this.user.id}/follow`
          )
          this.user = data
        }
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
  },
  head() {
    return {
      title: `${this.user.username} | Redline`,
    }
  },
}
</script>

<style lang="scss" scoped>
.active__tab {
  @apply border-b-0 border-t border-l border-r text-redline;
}
</style>
