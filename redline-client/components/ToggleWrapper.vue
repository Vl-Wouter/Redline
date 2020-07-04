<template>
  <div>
    <input
      :id="name"
      v-model="checked"
      :type="type"
      :name="name"
      :value="val"
      class="hidden"
      @change="onChange"
    />
    <label :for="name"><slot /></label>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Array, Boolean],
      default() {
        return []
      },
    },
    val: {
      type: [String, Number, Boolean],
      default: '',
    },
    type: {
      type: String,
      default: 'checkbox',
      validator(value) {
        return ['checkbox', 'radio'].includes(value)
      },
    },
  },
  data() {
    return {
      checkedProxy: false,
    }
  },
  computed: {
    checked: {
      get() {
        return this.value
      },
      set(val) {
        this.checkedProxy = val
      },
    },
  },
  methods: {
    onChange() {
      this.$emit('input', this.checkedProxy)
    },
  },
}
</script>
