<template>
  <div class="container">
    <h2>Login</h2>
    <alert v-if="error" type="error">{{ error.message }}</alert>
    <form method="POST" @submit.prevent="login">
      <form-field label="Username" field="username">
        <input
          id="username"
          v-model="user.username"
          type="text"
          name="username"
        />
      </form-field>
      <form-field label="Password" field="password">
        <input
          id="password"
          v-model="user.password"
          type="password"
          name="password"
        />
      </form-field>
      <button type="submit">Login</button>
      <a href="#" @click.prevent="router.push('/')">Cancel</a>
      <nuxt-link to="/login"><a>No account? Register here</a></nuxt-link>
    </form>
  </div>
</template>

<script>
import FormField from '@/components/forms/FormField'
import Alert from '@/components/Alert'
export default {
  layout: 'no_nav',
  components: {
    FormField,
    Alert
  },
  data: () => ({
    error: null,
    user: {
      username: '',
      password: ''
    }
  }),
  methods: {
    async login() {
      if (process.env.NODE_ENV === 'development' && !this.user.password) {
        this.user = {
          username: process.env.BYPASS_USER,
          password: process.env.BYPASS_PASS
        }
      }
      try {
        await this.$store.dispatch('user/signIn', this.user)
        this.$axios.setToken(this.$store.state.user.current.token, 'Bearer')
        this.$router.push('/')
      } catch (error) {
        this.error = error.response.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;

  form {
    width: 80%;
    text-align: left;
  }
}
</style>
