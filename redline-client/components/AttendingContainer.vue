<template>
  <main
    class="w-full fixed top-0 bg-gray-100 left-0 py-4 px-2 lg:relative bg-white lg:bg-opacity-0 z-top h-screen lg:h-auto invisible lg:visible"
  >
    <header class="w-full flex justify-between items-baseline">
      <h2 class="font-bold text-redline">{{ attending.length }} Going</h2>
      <button class="px-4 lg:hidden" @click="$emit('close', $el)">
        <font-awesome-icon icon="times" class="text-lg" />
      </button>
    </header>
    <main class="w-full">
      <nuxt-link
        v-for="guest in attending"
        :key="guest.id"
        :to="`/user/${guest.user.username}`"
      >
        <section
          class="my-4 px-4 py-2 rounded border bg-white flex flex-row items-center"
        >
          <img
            :src="getImage(guest)"
            alt="Guest image"
            class="w-16 h-16 rounded object-cover mr-8"
          />
          <div>
            <h3 class="font-bold">
              {{ guest.user.firstName }} {{ guest.user.lastName }}
            </h3>
            <p class="text-gray-700">{{ getVehicle(guest) }}</p>
          </div>
        </section>
      </nuxt-link>
    </main>
  </main>
</template>

<script>
export default {
  props: {
    attending: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
  },
  methods: {
    getImage(object) {
      return (
        '/api/img/' +
        ((object.vehicle && object.vehicle.photo) ?? object.user.profileImg)
      )
    },
    getVehicle(object) {
      return (
        (object.vehicle &&
          object.vehicle.year +
            ' ' +
            object.vehicle.make +
            ' ' +
            object.vehicle.model) ??
        'Going without a vehicle'
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.z-top {
  z-index: 9999;
}
</style>
