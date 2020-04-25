<template>
  <main>
    <header>
      <back-link text="Settings" />
    </header>
    <h2>Change profile settings</h2>
    <main>
      <form-field label="Change profile picture" field="avatar">
        <file-input
          name="avatar"
          round-preview
          :has-preview="imgPreview ? imgPreview : null"
          @files="updateAvatar"
        />
      </form-field>
      <h3>Update name</h3>
      <form method="POST" v-if="userData" @submit.prevent="updateProfile">
        <form-field label="First name" field="firstName">
          <text-input name="firstName" v-model="userData.firstName" />
        </form-field>
        <form-field label="Last name" field="lastName">
          <text-input name="lastName" v-model="userData.lastName" />
        </form-field>
        <form-field label="Username" field="username">
          <text-input name="username" v-model="userData.username" />
        </form-field>
        <v-button btn-type="submit" class="primary control"
          >Edit profile</v-button
        >
      </form>
    </main>
  </main>
</template>

<script>
import BackLink from '~/components/ui/BackLink'
import { FormField, FileInput, TextInput } from '~/components/forms'
import Button from '~/components/ui/Button'
export default {
  layout: 'no_Nav',
  middleware: ['authenticated', 'isSelf'],
  components: {
    BackLink,
    FormField,
    FileInput,
    TextInput,
    'v-button': Button
  },
  data: () => ({
    imgPreview: '',
    userData: null
  }),
  computed: {
    user() {
      return this.$store.getters['user/getSettingsData']
    }
  },
  mounted() {
    const { firstName, lastName, username } = this.$store.getters[
      'user/getSettingsData'
    ]
    this.userData = { firstName, lastName, username }
    this.imgPreview = {
      url: `${this.$axios.defaults.baseURL}/img/${this.user.profileImg}`,
      name: 'Current avatar'
    }
  },
  methods: {
    async updateAvatar(file) {
      console.log(this.user)
      try {
        const formData = new FormData()
        formData.append('image', file)
        await this.$store.dispatch('user/updateAvatar', formData)
      } catch (err) {
        console.log(err)
      }
    },
    async updateProfile() {
      try {
        await this.$store.dispatch('user/updateUser', this.userData)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
