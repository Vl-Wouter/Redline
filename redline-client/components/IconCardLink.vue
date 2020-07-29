<template>
  <nuxt-link :to="dest" append class="h-full">
    <icon-card
      :icon="icon"
      :title="title"
      :subtitle="subtitle"
      class="h-full"
    />
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
      type: [String, Array],
      default() {
        return ['fab', 'font-awesome']
      },
    },
    title: {
      type: String,
      default: 'Card Title',
    },
    subtitle: {
      type: String,
      default: null,
    },
    dest: {
      type: String,
      default: '#',
    },
  },
}
</script>
