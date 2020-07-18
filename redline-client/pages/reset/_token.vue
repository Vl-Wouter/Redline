<template>
  <main
    class="container mx-auto lg:w-1/3 px-2 flex flex-col h-screen items-center justify-center"
  >
    <h1 class="text-xl font-bold">Password reset</h1>
    <section v-if="user" class="my-2">
      <p>Please fill in a new password in the form below</p>
      <form method="post" @submit.prevent="submit">
        <f-group label="New Password" field="password">
          <input
            id="password"
            v-model="form.password"
            type="password"
            name="password"
            autocomplete="new-password"
          />
        </f-group>
        <f-group label="Confirm Password" field="confPassword">
          <input
            id="confPassword"
            v-model="form.confirmPassword"
            type="password"
            name="confPassword"
            autocomplete="confirm-password"
          />
        </f-group>
        <button class="w-full bg-redline text-white py-2 rounded" type="submit">
          Reset Password
        </button>
      </form>
    </section>
    <section v-else class="my-2">
      <p>This token is invalid or has expired. Please request a new one.</p>
    </section>
    <nuxt-link to="/forgot" class="text-rl-blue">Go back</nuxt-link>
  </main>
</template>

<script>
import axios from 'axios'
import ContentFormGroup from '~/components/ContentFormGroup'
export default {
  components: {
    'f-group': ContentFormGroup,
  },
  asyncData({ params }) {
    return axios
      .get(`/api/auth/reset/${params.token}`)
      .then((res) => {
        return {
          user: res.data,
        }
      })
      .catch((err) => {
        return {
          error: err,
          user: null,
        }
      })
  },
  data() {
    return {
      user: null,
      form: {
        password: '',
        confirmPassword: '',
      },
    }
  },
  methods: {
    async submit() {
      try {
        const { confirmPassword, ...values } = this.form
        if (confirmPassword !== values.password) {
          throw new Error('Passwords do not match')
        }
        await this.$axios.post(
          `/api/auth/reset/${this.$route.params.token}`,
          values
        )
        return this.$router.push('/login')
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
  },
  head() {
    return {
      title: 'Reset password | Redline',
    }
  },
}
</script>
