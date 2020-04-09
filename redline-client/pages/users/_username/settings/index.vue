<template>
  <div v-if="user">
    <a @click.prevent="$router.go(-1)">Go back</a>
    <header class="user__details">
      <div class="user__image"></div>
      <div class="user__details"></div>
    </header>
  </div>
</template>

<script>
export default {
  layout: 'no_nav',
  middleware: ['authenticated', 'isSelf'],
  data: () => ({
    user: {}
  })
}
</script>

<style lang="scss" scoped></style>
