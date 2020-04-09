<template>
  <div>
    <header>
      <v-button class="text-primary" @click.native="$router.go(-1)"
        ><unicon name="arrow-left"
      /></v-button>
      <h2>Add new content</h2>
    </header>
    <main>
      <nuxt-link to="/new/event">Event</nuxt-link>
    </main>
  </div>
</template>

<script>
import Button from '~/components/ui/Button'
export default {
  layout: 'no_nav',
  middleware: 'authenticated',
  components: {
    'v-button': Button
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
