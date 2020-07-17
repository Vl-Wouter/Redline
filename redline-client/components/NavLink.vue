<template>
  <nuxt-link
    :to="dest"
    class="relative text-gray-500 h-full py-2 lg:pb-2 flex flex-col items-center justify-center lg:text-center lg:pt-0"
  >
    <font-awesome-icon :icon="icon" class="text-xl" />
    <p class="text-xs" v-if="text">
      {{ text }}
    </p>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    dest: {
      type: String,
      default: '/',
    },
    icon: {
      type: String,
      default: 'home',
    },
    text: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.nuxt-link-exact-active {
  @apply text-redline;
}
</style>
