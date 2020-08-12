<template>
  <div>
    <modal class="hidden" id="confirm-modal">
      <h1 class="text-xl font-bold mb-2">Delete account</h1>
      <p>Are you sure you want to delete your account?</p>
      <div class="flex justify-between items-center my-2">
        <button class="py-2 px-4 bg-red-600 text-white rounded">Delete</button>
        <button
          @click="closeModal('confirm-modal')"
          class="py-2 px-4 bg-gray-100 text-rl-blue rounded"
        >
          Cancel
        </button>
      </div>
    </modal>
    <main class="container mx-auto lg:w-1/2 mt-4 px-2">
      <header class="flex flex-row space-x-4">
        <button
          class="text-redline"
          @click="$router.push(`/user/${user.username}/settings`)"
        >
          <font-awesome-icon icon="arrow-left" />
        </button>
        <h2 class="font-bold text-lg">Change account settings</h2>
      </header>
      <main>
        <form method="post" class="w-full" @submit.prevent="submit">
          <f-group
            label="Username"
            field="username"
            helper="Change your username"
          >
            <input
              id="username"
              v-model="form.username"
              type="text"
              name="username"
            />
          </f-group>
          <f-group label="Email" field="email" helper="Change your email">
            <input id="email" v-model="form.email" type="email" name="email" />
          </f-group>
          <f-group label="New Password" field="password">
            <input
              id="password"
              v-model="form.password"
              type="password"
              name="password"
              autocomplete="new-password"
            />
          </f-group>
          <f-group label="Confirm Password" field="confirm-password">
            <input
              id="confPass"
              v-model="validation.password"
              type="password"
              name="confirm-password"
            />
          </f-group>
          <f-group
            label="Current password"
            field="current-password"
            helper="Enter your current password to make changes to your account"
          >
            <input
              id="currentPass"
              v-model="form.currentPassword"
              type="password"
              name="current-password"
            />
          </f-group>
          <button
            class="w-full rounded bg-redline text-white py-2"
            type="submit"
          >
            Update Account
          </button>
        </form>
        <!-- <button
          @click="showModal('confirm-modal')"
          class="w-full text-red-600 border border-red-600 py-2 my-4 rounded"
        >
          Remove account
        </button> -->
      </main>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import ContentFormGroup from '~/components/ContentFormGroup'
import Modal from '~/components/Modal'
export default {
  middleware: 'auth',
  components: {
    'f-group': ContentFormGroup,
    Modal,
  },
  asyncData({ params }) {
    return axios.get(`/api/users/${params.slug}?add=email`).then((res) => {
      return {
        user: res.data,
        form: {
          username: res.data.username,
          email: res.data.email,
        },
      }
    })
  },
  data() {
    return {
      user: null,
      form: {
        username: null,
        password: null,
        email: null,
        currentPassword: '',
      },
      validation: {
        password: '',
      },
    }
  },
  methods: {
    showModal(id) {
      document.querySelector(`#${id}`).classList.remove('hidden')
    },
    closeModal(id) {
      document.querySelector(`#${id}`).classList.add('hidden')
    },
    async submit() {
      try {
        if (!this.form.currentPassword) {
          throw new Error('Please enter your current password')
        }
        if (
          this.form.password &&
          this.form.password !== this.validation.password
        ) {
          throw new Error('Passwords do not match')
        }
        const { data } = await this.$axios.patch(
          `/api/users/${this.user.id}?type=account`,
          this.form
        )
        this.user = data
        return this.$router.push(`/user/${this.user.username}/settings`)
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
  },
  head() {
    return {
      title: 'Account settings | Redline',
    }
  },
}
</script>
