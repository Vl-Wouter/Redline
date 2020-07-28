<template>
  <main
    class="fixed top-0 left-0 z-top bg-black bg-opacity-50 w-screen h-screen flex justify-center items-center px-2"
  >
    <section class="relative rounded bg-white py-4 px-4 w-full lg:w-1/2">
      <button class="text-redline absolute top-0 right-0 mr-4 mt-4 text-lg">
        <font-awesome-icon icon="times" @click="close" />
      </button>
      <slot />
    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {
      open: true,
    }
  },
  methods: {
    close() {
      this.open = false
      this.$el.classList.add('hidden')
    },
  },
}
</script>

<style lang="scss" scoped>
.z-top {
  z-index: 99999;
}
</style>
