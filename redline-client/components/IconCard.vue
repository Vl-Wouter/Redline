<template>
  <div
    class="w-full rounded border bg-white px-4 py-4 flex flex-row lg:flex-col lg:text-center items-center"
  >
    <font-awesome-icon v-if="icon" :icon="icon" class="text-2xl text-redline" />
    <section :class="icon ? 'pl-4 lg:pl-0 lg:pt-2' : ''">
      <h2 class="font-bold">{{ title }}</h2>
      <p v-if="subtitle" class="text-sm text-gray-700">{{ subtitle }}</p>
    </section>
  </div>
</template>

<script>
export default {
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
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.selected {
  transition: all 0.3s ease-in-out;
  @apply text-white bg-redline;
  * {
    @apply text-white;
  }
}
</style>
