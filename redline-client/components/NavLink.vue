<template>
  <nuxt-link :to="dest" class="relative h-full py-2 lg:pb-2 lg:pt-0">
    <font-awesome-icon :icon="icon" class="text-xl" />
    <span class="pl-1 hidden lg:inline">{{ text }}</span>
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
      default: 'Home',
    },
  },
}
</script>

<style lang="scss" scoped>
.nuxt-link-exact-active {
  @apply text-redline;

  &::after {
    content: '';
    height: 4px;
    width: 100%;
    position: absolute;
    bottom: 0;
    border-radius: 0.25rem 0.25rem 0 0;
    @apply block bg-redline;
  }
}
</style>
