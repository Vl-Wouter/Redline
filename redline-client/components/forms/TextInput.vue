<template>
  <input
    :id="name"
    :type="inputType"
    class="input"
    :value="value"
    :placeholder="placeholder"
    :name="name"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default() {
        return null
      }
    },
    inputType: {
      type: String,
      default() {
        return 'text'
      }
    },
    placeholder: {
      type: String,
      default() {
        return ''
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
.input {
  width: 100%;
  padding: 12px 8px;
  background: app-color-level('background', -0.6);
  font-family: $base-font-family;
  border-radius: 4px;
  border: none;

  &.error {
    background: app-color-level('error', 7);
  }
}
</style>
