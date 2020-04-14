<template>
  <main class="center">
    <header class="step__header">
      <p>Step {{ step }} of {{ totalSteps }}</p>
    </header>
    <section v-show="step === 0">
      <h2>Create a new account</h2>
      <p>
        Welcome to Redline! To make signing up easy and convenient, we offer a
        few options to get you started as soon as possible.
      </p>
      <v-button class="control selection"
        ><unicon name="instagram" height="16" disabled />Register with Instagram
        (coming soon)</v-button
      >
      <v-button class="primary control selection" @click.native="step++"
        ><unicon name="envelope" height="16" />Register with email</v-button
      >
      <v-button class="control text-error" @click.native="$router.push('/')"
        >Cancel</v-button
      >
    </section>
    <form method="POST" @submit.prevent="submitForm">
      <section v-show="step === 1" class="form__step">
        <p>
          Let's begin by adding some basic information to create your profile.
        </p>
        <form-field
          label="E-mail"
          field="email"
          :error="
            validation.exists.email
              ? 'An account with this email exists already'
              : null
          "
        >
          <text-input
            name="email"
            v-model="user.email"
            @blur.native="hasExistingValue('email')"
            :class="{ error: validation.exists.email }"
          />
        </form-field>
        <form-field
          label="Username"
          field="username"
          :error="validation.exists.username ? 'This username is taken' : null"
        >
          <text-input
            name="username"
            v-model="user.username"
            @blur.native="hasExistingValue('username')"
            :class="{ error: validation.exists.username }"
          />
        </form-field>
        <form-field
          label="Password"
          field="password"
          :error="passwordCheck ? '' : 'Password is too weak'"
        >
          <text-input
            input-type="password"
            name="password"
            v-model="user.password"
          />
        </form-field>
        <form-field
          label="Confirm password"
          field="confirmPassword"
          :helper="!matchPasswords ? 'Make sure the passwords match' : ''"
        >
          <text-input
            input-type="password"
            name="confirmPassword"
            v-model="confirmPass"
          />
        </form-field>
      </section>
      <section class="form__step" v-show="step === 2">
        <form-field label="Profile Picture" field="profileImg">
          <file-input
            name="profileImg"
            round-preview
            @files="
              (fileData) => {
                user.profileImg = fileData
              }
            "
          />
        </form-field>
        <form-field label="First Name" field="firstName">
          <text-input name="firstName" v-model="user.firstName" />
        </form-field>
        <form-field label="Last Name" field="lastName">
          <text-input name="lastName" v-model="user.lastName" />
        </form-field>
        <section class="roles">
          <toggle-input
            v-for="role in roles"
            :key="role"
            type="radio"
            :name="role"
            :val="role"
            v-model="user.roles"
            :toggle-label="role"
          />
        </section>
      </section>
      <section class="btn__container" v-if="step > 0">
        <v-button class="text-error control" @click.native="step--"
          >Back</v-button
        >
        <v-button
          v-if="step === totalSteps"
          class="primary control"
          btn-type="submit"
          :disabled="!isValid"
        >
          Create Account
        </v-button>
        <v-button
          v-else
          class="primary control"
          @click.native="step++"
          :disabled="!isValid"
          >Next</v-button
        >
      </section>
    </form>
  </main>
</template>

<script>
import Button from '~/components/ui/Button'
import {
  FormField,
  TextInput,
  ToggleInput,
  FileInput
} from '~/components/forms'
export default {
  layout: 'noNavNoMargin',
  components: {
    'v-button': Button,
    FormField,
    TextInput,
    ToggleInput,
    FileInput
  },
  data: () => ({
    step: 0,
    totalSteps: 0,
    roles: ['ORGANISER', 'PHOTOGRAPHER', 'OWNER'],
    user: {
      email: '',
      password: '',
      roles: '',
      firstName: '',
      lastName: '',
      profileImg: ''
    },
    validation: {
      exists: {
        email: false,
        username: false
      }
    },
    confirmPass: ''
  }),
  computed: {
    passwordCheck() {
      return (
        this.user.password.length > 0 &&
        this.user.password.match(
          /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
        ) &&
        this.user.password.length >= 8
      )
    },
    matchPasswords() {
      if (this.user.password !== '' && this.confirmPass !== '') {
        return this.user.password === this.confirmPass
      }
      return false
    },
    isValid() {
      switch (this.step) {
        case 1:
          return (
            !this.validation.exists.email &&
            !this.validation.exists.username &&
            this.passwordCheck &&
            this.matchPasswords
          )
        case 2:
          return this.user.firstName && this.user.lastName && this.user.roles
        default:
          return false
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.totalSteps = document.querySelectorAll('.form__step').length
    })
  },
  methods: {
    async hasExistingValue(field) {
      const value = this.user[field]
      try {
        const { data } = await this.$axios.post('/auth/check', {
          field,
          value
        })
        if (data) this.validation.exists[field] = true
        else this.validation.exists[field] = false
      } catch (error) {
        console.log(error)
      }
    },
    async submitForm() {
      const formData = new FormData()
      for (const key in this.user) {
        formData.append(key, this.user[key])
      }
      try {
        await this.$axios.post('/auth/signup', formData)
        this.$store.dispatch('user/signIn', {
          username: this.user.username,
          password: this.user.password
        })
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  text-align: center;
  padding: 0 32px;
  position: relative;

  header {
    position: absolute;
    top: 16px;
  }

  button.selection {
    margin: 8px 0;
    padding: 24px 8px;
  }

  button.primary:disabled {
    background: app-color-level('primary', 4);
    cursor: not-allowed;
  }

  form {
    width: 100%;
    text-align: left;
  }

  .form__step {
    width: 100%;
  }
}

.btn__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
