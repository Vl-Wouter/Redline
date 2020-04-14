<template>
  <div>
    <header>
      <back-link text="Back" />
    </header>
    <main>
      <nuxt-link to="/new/event">Event</nuxt-link>
    </main>
  </div>
</template>

<script>
import BackLink from '~/components/ui/BackLink'
export default {
  layout: 'no_nav',
  middleware: 'authenticated',
  components: {
    BackLink
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  button.btn {
    .unicon {
      fill: app-color();
      display: inline-block;
      height: 24px;
    }
    line-height: 24px;
    display: flex;
    align-items: center;
    padding: 0;
  }
}
</style>
