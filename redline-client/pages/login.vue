<template>
  <div class="container">
    <h2>Login</h2>
    <alert v-if="error" type="error">{{ error.message }}</alert>
    <form method="POST" @submit.prevent="login">
      <form-field label="Username" field="username">
        <text-input v-model="user.username" input-type="text" name="username" />
      </form-field>
      <form-field label="Password" field="password">
        <nuxt-link to="#">Forgot password?</nuxt-link>
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
      <div class="center">
        <nuxt-link to="/register" class="center__link"
          >No account? Register here</nuxt-link
        >
      </div>
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
        const errObj = error.response ? error.response.data : error
        this.$nuxt.error({ message: errObj.message, statusCode: errObj.status })
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

    a {
      font-weight: 400;
      font-size: 0.9rem;
    }
  }

  button.btn {
    margin: 8px 0;
  }
}

.center__link {
  width: 100%;
  text-align: center;
  font-weight: 400;
}

.center {
  width: 100%;
  text-align: center;
}
</style>
