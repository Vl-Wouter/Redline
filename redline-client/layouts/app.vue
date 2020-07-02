<template>
  <main class="relative">
    <header
      class="sticky px-4 pt-4 flex flex-row flex-wrap items-center border-b border-solid border-gray-200 lg:justify-between"
    >
      <p class="w-1/2 lg:w-auto lg:order-first font-bold">Redline Logo</p>
      <div class="w-1/2 lg:w-auto lg:order-last text-right">
        <img
          v-if="user"
          src=""
          alt=""
          class="inline w-8 h-8 cover bg-gray-100 rounded-full overflow-hidden"
        />
        <nuxt-link to="/login" class="rounded px-2 py-2 bg-redline text-white">
          Log in
        </nuxt-link>
      </div>
      <nav
        class="w-full text-redline-light lg:w-auto flex flex-row justify-between pt-3 lg:pt-0 lg:justify-end space-x-4 lg:space-x-8"
      >
        <nav-link />
        <nav-link dest="/map" icon="map" text="Map" />
      </nav>
    </header>
    <Nuxt class="mt-2" />
  </main>
</template>

<script>
import NavLink from '~/components/NavLink'
export default {
  layout: 'default',
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
