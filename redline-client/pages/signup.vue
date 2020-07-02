<template>
  <div class="min-h-screen bg-gray-100">
    <header
      class="sticky top-0 z-10 w-full shadow-sm py-2 px-4 flex flex-row justify-between lg:justify-center lg:space-x-48 items-center bg-white"
    >
      <button class="text-redline" @click="goBack">
        {{ steps.current > 1 ? 'Back' : 'Cancel' }}
      </button>
      <p class="text-gray-700">Step {{ steps.current }} of {{ steps.total }}</p>
      <button class="py-1 px-2 bg-redline text-white rounded" @click="nextStep">
        {{ steps.current === steps.total ? 'Submit' : 'Next' }}
      </button>
    </header>
    <main class="container mx-auto">
      <form method="post" class="lg:w-1/2 lg:mx-auto">
        <div v-show="steps.current === 1" class="step w-full px-4" id="step-0">
          <p class="mt-2 text-center text-sm text-gray-700">
            Lets start with some basic info to start your profile.
          </p>
          <div class="lg:grid lg:grid-cols-2 gap-4 lg:mt-4">
            <section class="w-full my-4 lg:my-0">
              <label for="email" class="text-sm block text-gray-800 mb-2"
                >Email</label
              >
              <input
                v-model="user.email"
                type="email"
                name="email"
                id="email"
                class="border focus:border-redline focus:outline-none rounded w-full py-2 px-2"
              />
              <p class="text-xs text-gray-600 mt-2">
                This email address will be used to log you in
              </p>
            </section>
            <section class="w-full my-4 lg:my-0">
              <label for="username" class="text-sm block text-gray-800 mb-2"
                >Username</label
              >
              <input
                v-model="user.username"
                type="text"
                name="username"
                id="username"
                class="border focus:border-redline focus:outline-none rounded w-full py-2 px-2"
              />
              <p class="text-xs text-gray-600 mt-2">
                This is a username used to identify you.
              </p>
            </section>
            <section class="w-full my-4 lg:my-0">
              <label for="password" class="text-sm block text-gray-800 mb-2"
                >Password</label
              >
              <input
                v-model="user.password"
                type="password"
                name="password"
                id="password"
                class="border focus:border-redline focus:outline-none rounded w-full py-2 px-2"
              />
            </section>
            <section class="w-full my-4 lg:my-0">
              <label
                for="password_confirm"
                class="text-sm block text-gray-800 mb-2"
                >Confirm password</label
              >
              <input
                v-model="user.passwordConfirm"
                type="password"
                name="password_confirm"
                id="password_confirm"
                class="border focus:border-redline focus:outline-none rounded w-full py-2 px-2"
              />
            </section>
          </div>
        </div>
        <div v-show="steps.current === 2" class="step w-full px-4" id="step-2">
          <p class="mt-2 text-center text-sm text-gray-700">
            Now complete your profile with some extra details
          </p>
          <section
            class="relative w-full lg:w-1/2 lg:mx-auto border rounded mb-4 mt-12 bg-white shadow-sm px-4 py-2"
          >
            <div
              class="w-24 h-24 rounded-full border-4 border-gray-100 bg-gray-400 mx-auto transform -translate-y-1/2 overflow-hidden"
            >
              <img
                v-if="user.profileImg"
                src=""
                alt=""
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex flex-row justify-between items-center -mt-8">
              <section>
                <p class="text-lg text-redline">
                  {{ user.firstName || 'First' }} {{ user.lastName || 'Last' }}
                </p>
                <p class="text-sm text-gray-700 italic">
                  {{ user.username || 'username' }}
                </p>
              </section>
              <section class="text-right">
                <p class="text-gray-700">
                  {{ user.role || 'No role' }}
                </p>
                <p class="text-sm text-redline-light">
                  {{ user.email || 'username@example.com' }}
                </p>
              </section>
            </div>
          </section>
          <div class="lg:grid lg:grid-cols-2 gap-4">
            <section class="w-full my-4 lg:my-0">
              <label for="firstName" class="text-sm block text-gray-800 mb-2"
                >First name</label
              >
              <input
                v-model="user.firstName"
                type="text"
                name="firstName"
                id="firstName"
                class="border focus:border-redline focus:outline-none rounded w-full py-2 px-2"
              />
            </section>
            <section class="w-full my-4 lg:my-0">
              <label for="lastName" class="text-sm block text-gray-800 mb-2"
                >Last name</label
              >
              <input
                v-model="user.lastName"
                type="text"
                name="lastName"
                id="lastName"
                class="border focus:border-redline focus:outline-none rounded w-full py-2 px-2"
              />
            </section>
          </div>
          <section class="w-full my-4">
            <label for="profileImg" class="text-sm block text-gray-800 mb-2"
              >Upload a profile image</label
            >
          </section>
          <section class="w-full my-4">
            <p class="text-sm block text-gray-800 mb-2">
              What role fits best for you?
            </p>
            <p class="text-xs text-gray-600 mt-2">
              Your choice will not influence your experience, but will help
              others looking to contact people.
            </p>
            <section class="my-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <icon-card
                icon="camera"
                title="Photographer"
                subtitle="You like taking and sharing photos"
              />
              <icon-card
                icon="car"
                title="Owner"
                subtitle="You want to show off your car at events"
              />
              <icon-card
                icon="calendar-plus"
                title="Organiser"
                subtitle="You want to share your events"
              />
            </section>
          </section>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import IconCard from '~/components/IconCard'
export default {
  middleware({ store, redirect, from }) {
    if (store.state.user.current) {
      redirect(from)
    }
  },
  components: {
    IconCard,
  },
  data() {
    return {
      steps: {
        current: 1,
        total: null,
      },
      user: {
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        role: '',
        profileImg: '',
      },
      passwordConfirm: '',
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.steps.total = document.querySelectorAll('.step').length
    })
  },
  methods: {
    goBack() {
      if (this.steps.current === 1) {
        this.$router.push('/login')
      } else {
        this.steps.current--
      }
    },
    nextStep() {
      this.steps.current++
    },
  },
}
</script>

<style lang="scss" scoped></style>
