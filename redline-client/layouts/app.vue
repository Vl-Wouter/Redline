<template>
  <main class="relative bg-gray-100 w-screen min-h-screen">
    <nav
      id="nav"
      class="w-full z-40 fixed top-0 bg-white lg:bg-gray-900 border-b px-4 shadow-sm py-2 lg:flex lg:flex-col lg:w-auto lg:h-screen"
    >
      <div class="w-full flex justify-between mb-2 lg:mb-8">
        <nuxt-link to="/" class="logoFont text-xl text-redline"
          >Redline</nuxt-link
        >
        <div class="lg:hidden">
          <nuxt-link
            v-if="user"
            :to="`/user/${user.username}`"
            class="block w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden"
          >
            <img
              :src="`/api/img/${user.profileImg}`"
              alt="U"
              class="h-full w-full object-cover"
            />
          </nuxt-link>
          <nuxt-link
            v-else
            to="/login"
            class="block w-8 h-8 rounded-full bg-rl-blue border text-white flex items-center justify-center"
            ><font-awesome-icon icon="sign-in-alt"
          /></nuxt-link>
        </div>
      </div>
      <div
        class="w-full flex lg:flex-col lg:space-y-4 lg:items-center justify-between"
      >
        <nav-link text="Home" />
        <nav-link dest="/events" icon="calendar" text="Events" />
        <nav-link dest="/albums" icon="images" text="Gallery" />
        <!-- <nav-link dest="/articles" icon="newspaper" text="Articles" /> -->
        <nav-link dest="/map" icon="map" text="Map" />
      </div>
      <div
        class="hidden lg:flex w-full justify-center items-center absolute bottom-0 mb-4 left-0"
      >
        <nuxt-link
          v-if="user"
          :to="`/user/${user.username}`"
          class="block w-12 h-12 rounded-full border flex items-center justify-center overflow-hidden"
        >
          <img
            :src="`/api/img/${user.profileImg}`"
            alt="U"
            class="h-full w-full object-cover"
          />
        </nuxt-link>
        <nuxt-link
          v-else
          to="/login"
          class="block w-full py-2 mx-2 rounded bg-rl-blue border text-white flex items-center justify-center"
          >Log in</nuxt-link
        >
      </div>
    </nav>
    <Nuxt id="nuxtCont" class="overflow-auto clearNav lg:pt-4 lg:pl-8" />
  </main>
</template>

<script>
import NavLink from '~/components/NavLink'
export default {
  components: {
    NavLink,
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
  },
}
</script>
<style lang="scss" scoped>
.logoFont {
  font-family: 'Racing Sans One', sans-serif;
}

.clearNav {
  padding-top: 7rem;

  @screen lg {
    padding-top: 1rem;
  }
}
</style>
