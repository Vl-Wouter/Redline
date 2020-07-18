<template>
  <main class="container lg:w-1/2 mx-auto px-2">
    <section class="w-full my-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <icon-card-link
        icon="cog"
        title="Account"
        subtitle="Change your username, password or email"
        dest="account"
      />
      <icon-card-link
        icon="user"
        title="Profile"
        subtitle="Change your name or profile picture"
        dest="profile"
      />
      <icon-card-link
        v-if="user && user.isAdmin"
        icon="gavel"
        title="Reports"
        subtitle="View all reported events, albums and articles"
        dest="mod-queue"
      />
    </section>
    <button
      class="bg-redline text-white w-full my-4 py-2 rounded"
      @click="signOut"
    >
      Log out
    </button>
  </main>
</template>

<script>
import IconCardLink from '~/components/IconCardLink'
export default {
  layout: 'app',
  middleware: 'auth',
  components: {
    IconCardLink,
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
  },
  methods: {
    signOut() {
      this.$store.dispatch('user/signOut')
      this.$router.push('/')
    },
  },
  head() {
    return {
      title: 'Settings | Redline',
    }
  },
}
</script>
