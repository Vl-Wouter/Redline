<template>
  <div class="check__container">
    <input
      type="checkbox"
      :name="name"
      :id="name"
      :value="val"
      v-model="checked"
      @change="onChange"
    />
    <label :for="name">{{ checkLabel }}</label>
  </div>
</template>

<script>
export default {
  data: () => ({
    checkedProxy: false
  }),
  props: {
    name: {
      type: String,
      default() {
        return ''
      }
    },
    value: {
      type: [String, Array],
      default() {
        return []
      }
    },
    val: {
      type: [String, Number],
      default() {
        return ''
      }
    },
    checkLabel: {
      type: String,
      default() {
        return 'Put a label here please'
      }
    }
  },
  computed: {
    checked: {
      get() {
        return this.value
      },
      set(val) {
        this.checkedProxy = val
      }
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.checkedProxy)
    }
  }
}
</script>

<style lang="scss" scoped>
.check__container {
  margin: 8px 0;
  display: flex;
  align-items: center;

  input {
    margin-right: 8px;
  }
}
</style>
