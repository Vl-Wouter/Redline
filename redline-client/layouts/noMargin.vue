<template>
  <main class="noMargin">
    <nuxt />
    <v-nav />
  </main>
</template>

<script>
import Nav from '@/components/Nav'
export default {
  components: {
    'v-nav': Nav
  }
}
</script>

<style lang="scss" scoped>
.noMargin {
  padding: 0;
  min-height: 100vh;
}
</style>
