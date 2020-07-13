<template>
  <main
    class="w-full h-screen bg-gray-100 px-2 flex flex-col items-center justify-center space-y-2"
  >
    <h1 class="text-xl font-bold">Forgot your password?</h1>
    <p>
      Enter your email address in the field below and we'll have you set up in
      no time.
    </p>
    <form @submit.prevent="submit" class="w-full lg:w-1/3 space-y-4">
      <input
        v-model="form.email"
        type="email"
        name="email"
        id="email"
        class="w-full border px-4 py-2 rounded focus:border-redline focus:outline-none"
      />
      <button type="submit" class="w-full rounded text-white bg-redline py-2">
        Request password reset
      </button>
    </form>
    <nuxt-link to="login" class="text-rl-blue">Go back</nuxt-link>
  </main>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
      },
    }
  },
  methods: {
    async submit() {
      try {
        await this.$axios.post('/api/auth/forgot', this.form)
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
  },
}
</script>
