<template>
  <datetime :type="dateType" :value="value" input-class="datetime__input" />
</template>

<script>
import { Datetime } from 'vue-datetime'
export default {
  components: {
    Datetime
  },
  props: {
    value: {
      type: String,
      default() {
        return ''
      }
    },
    dateType: {
      type: String,
      default() {
        return 'date'
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.datetime__input {
  width: 100%;
  padding: 12px 8px;
  background: app-color-level('background', -0.6);
  font-family: $base-font-family;
  border-radius: 4px;
  border: none;
  margin: 8px 0;
}
</style>
