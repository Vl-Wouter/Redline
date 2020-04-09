<template>
  <div class="radio__container">
    <input
      :id="name"
      v-model="value"
      type="radio"
      :name="name"
      @input="$emit('input', $event.target.value)"
    />
    <label :for="name">{{ radioLabel }}</label>
  </div>
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
    value: {
      type: String,
      default() {
        return ''
      }
    },
    radioLabel: {
      type: String,
      default() {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.radio__container {
  margin: 8px 0;
  display: flex;
  align-items: center;

  input {
    margin-right: 8px;
  }
}
</style>
