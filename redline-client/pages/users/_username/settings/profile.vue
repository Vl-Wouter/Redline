<template>
  <main>
    <back-link text="Settings" />
  </main>
</template>

<script>
import BackLink from '~/components/ui/BackLink'
export default {
  layout: 'no_Nav',
  middleware: ['authenticated', 'isSelf'],
  components: {
    BackLink
  },
  computed: {
    user() {
      return this.$store.getters['user/getSettingsData']
    }
  }
}
</script>

<style lang="scss" scoped></style>
