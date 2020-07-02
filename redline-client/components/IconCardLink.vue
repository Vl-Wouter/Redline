<template>
  <nuxt-link :to="dest" append>
    <icon-card :icon="icon" :title="title" :subtitle="subtitle" />
  </nuxt-link>
</template>

<script>
import IconCard from './IconCard'
export default {
  components: {
    IconCard,
  },
  props: {
    icon: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: 'Card Title',
    },
    subtitle: {
      type: String,
      default: 'This card has a link',
    },
    dest: {
      type: String,
      default: '#',
    },
  },
}
</script>
