<template>
  <main class="page">
    <header>
      <back-link text="Settings" />
      <h2>Change account settings</h2>
    </header>
    <main>
      <form method="POST" @submit.prevent="updateProfile">
        <form-field label="E-mail" field="email">
          <text-input name="email" v-model="form.email" />
        </form-field>
        <form-field
          label="Current password"
          field="curPass"
          :error="errors.password"
        >
          <text-input
            name="newPass"
            v-model="form.current_password"
            input-type="password"
          />
        </form-field>
        <form-field label="New password" field="newPass">
          <text-input
            name="newPass"
            v-model="form.password"
            input-type="password"
          />
        </form-field>
        <form-field
          label="Confirm password"
          field="confirmPass"
          :error="hasMatchingPasswords ? '' : 'Passwords do not match'"
        >
          <text-input
            name="confirmPass"
            v-model="form.confirm_password"
            input-type="password"
          />
        </form-field>
        <v-button btn-type="submit" class="primary control"
          >Edit account settings</v-button
        >
      </form>
    </main>
  </main>
</template>

<script>
import BackLink from '~/components/ui/BackLink'
import { FormField, TextInput } from '~/components/forms'
import Button from '~/components/ui/Button'

export default {
  layout: 'no_nav',
  middleware: ['authenticated', 'isSelf'],
  components: {
    BackLink,
    FormField,
    TextInput,
    'v-button': Button
  },
  computed: {
    user() {
      return this.$store.getters['user/getSettingsData']
    },
    hasMatchingPasswords() {
      return this.password === this.confirm_password
    }
  },
  data: () => ({
    form: {
      email: '',
      password: '',
      confirm_password: '',
      current_password: ''
    },
    errors: {}
  }),
  mounted() {
    this.$nextTick(() => {
      this.form.email = this.user.email
    })
  },
  methods: {
    updateProfile() {
      const form = this.form
      Object.keys(form).forEach((item) => !form[item] && delete form[item])
      if (!form.current_password) {
        this.errors.password = 'Please enter your password'
        return false
      }
      try {
        this.$store.dispatch('user/updateUser', form)
      } catch (error) {
        this.errors.main = error
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@media (min-width: 900px) {
  .page {
    margin: 0 auto;
    width: 65%;
  }
}
</style>
