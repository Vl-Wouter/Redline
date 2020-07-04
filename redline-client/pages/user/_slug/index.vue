<template>
  <main class="container mx-auto px-2">
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
      <button class="w-full py-2 bg-redline text-white rounded">Follow</button>
    </section>
    <section class="tabs">
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
    </section>
  </main>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'app',
  asyncData({ params }) {
    return axios.get(`/api/auth/${params.slug}`).then((res) => {
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
  },
}
</script>

<style lang="scss" scoped>
.active__tab {
  @apply border-b-0 border-t border-l border-r text-redline;
}
</style>
