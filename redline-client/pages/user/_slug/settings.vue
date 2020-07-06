<template>
  <main class="container mx-auto px-2">
    <button
      class="bg-redline text-white w-full my-4 py-2 rounded"
      @click="signOut"
    >
      Log out
    </button>
  </main>
</template>

<script>
export default {
  layout: 'app',
  middleware: 'auth',
  methods: {
    signOut() {
      this.$store.dispatch('user/signOut')
      this.$router.push('/')
    },
  },
}
</script>
