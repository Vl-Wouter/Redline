<template>
  <select
    :id="name"
    :name="name"
    :value="value"
    class="select"
    @input="$emit('input', $event.target.value)"
  >
    <option :value="null" disabled selected>Select one</option>
    <option v-for="option in options" :key="option.id" :value="option.id">{{
      option.name
    }}</option>
  </select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default() {
        return null
      }
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    name: {
      type: String,
      default() {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.select {
  width: 100%;
  padding: 12px 8px;
  background: app-color-level('background', -0.8);
  border: none;
  border-radius: 4px;
  font-family: $base-font-family;
}
</style>
