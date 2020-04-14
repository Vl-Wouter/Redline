<template>
  <textarea
    :id="name"
    :name="name"
    :rows="rows"
    :value="value"
    :placeholder="placeholder"
    class="textarea"
    @input="$emit('input', $event.target.value)"
  ></textarea>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default() {
        return ''
      }
    },
    rows: {
      type: Number,
      default() {
        return 3
      }
    },
    value: {
      type: String,
      default() {
        return ''
      }
    },
    placeholder: {
      type: String,
      default() {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.textarea {
  width: 100%;
  padding: 8px;
  background: app-color-level('background', -0.8);
  border-radius: 4px;
  border: none;
  font-family: $base-font-family;
}
</style>
