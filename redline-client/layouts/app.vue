<template>
  <main class="relative bg-gray-100 w-screen min-h-screen">
    <header
      class="sticky px-4 pt-4 bg-white flex flex-row flex-wrap items-center border-b border-solid border-gray-200 justify-between"
    >
      <p
        class="w-1/2 lg:w-auto lg:order-first font-bold logoFont text-redline text-xl"
      >
        Redline
      </p>
      <div class="h-full lg:w-auto lg:order-last text-right">
        <nuxt-link
          v-if="user"
          :to="`/user/${user.username}`"
          class="block right-0 w-8 h-8 cover bg-gray-200 rounded-full overflow-hidden flex justify-center items-center"
        >
          <img v-if="user.profileImg" src="" alt="" class="" />
          <span v-else>U</span>
        </nuxt-link>
        <nuxt-link
          v-else
          to="/login"
          class="rounded px-2 py-2 bg-redline text-white"
        >
          Log in
        </nuxt-link>
      </div>
      <nav
        class="w-full text-redline-light lg:w-auto flex flex-row justify-between pt-3 lg:pt-0 lg:justify-end space-x-4 lg:space-x-8"
      >
        <nav-link />
        <nav-link dest="/events" icon="calendar" text="Events" />
        <nav-link dest="/map" icon="map" text="Map" />
      </nav>
    </header>
    <Nuxt class="overflow-auto" />
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
</style>
