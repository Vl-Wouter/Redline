<template>
  <div class="container">
    <h2>Login</h2>
    <alert v-if="error" type="error">{{ error.message }}</alert>
    <form method="POST" @submit.prevent="login">
      <form-field label="Username" field="username">
        <text-input v-model="user.username" input-type="text" name="username" />
      </form-field>
      <form-field label="Password" field="password">
        <text-input
          v-model="user.password"
          input-type="password"
          name="password"
        />
      </form-field>
      <v-button btn-type="submit" class="primary control">Log in</v-button>
      <v-button
        btn-type="button"
        class="text-error control"
        @click.native.prevent="$router.push('/')"
        >Cancel</v-button
      >
      <nuxt-link to="/login"><a>No account? Register here</a></nuxt-link>
    </form>
  </div>
</template>

<script>
import { FormField, TextInput } from '~/components/forms'
import Alert from '@/components/Alert'
import Button from '~/components/ui/Button'
export default {
  layout: 'no_nav',
  components: {
    FormField,
    TextInput,
    Alert,
    'v-button': Button
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
