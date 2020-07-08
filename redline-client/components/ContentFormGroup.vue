<template>
  <section class="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
    <div>
      <label :for="field" class="block">{{ label }}</label>
      <p v-if="helper" class="text-sm text-gray-700">{{ helper }}</p>
    </div>
    <div>
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    field: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: 'Label',
    },
    helper: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
input,
textarea,
select {
  @apply border rounded w-full py-2 px-2 bg-white;

  &:focus {
    @apply border-redline outline-none;
  }
}
</style>
