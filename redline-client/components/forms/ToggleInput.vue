<template>
  <div class="check__container">
    <input
      :type="type"
      :name="name"
      :id="name"
      :value="val"
      v-model="checked"
      @change="onChange"
    />
    <label v-if="toggleLabel" :for="name">{{ toggleLabel }}</label>
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
      type: [String, Array, Boolean],
      default() {
        return []
      }
    },
    val: {
      type: [String, Number, Boolean],
      default() {
        return ''
      }
    },
    toggleLabel: {
      type: String,
      default() {
        return null
      }
    },
    type: {
      type: String,
      default() {
        return 'checkbox'
      },
      validator(value) {
        return ['checkbox', 'radio'].includes(value)
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
