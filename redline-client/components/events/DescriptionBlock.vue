<template>
  <section>
    <section
      class="text__block"
      :class="{ expandable, expanded }"
      v-html="sanitizedContent"
    ></section>
    <button v-if="expandable" @click="toggleContent">
      Read {{ expanded ? 'less' : 'more' }}
    </button>
  </section>
</template>

<script>
export default {
  data: () => ({
    expanded: false
  }),
  props: {
    expandable: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: null
    }
  },
  computed: {
    sanitizedContent() {
      return this.$sanitize(this.content)
    }
  },
  methods: {
    toggleContent() {
      this.expanded = !this.expanded
    }
  }
}
</script>

<style lang="scss" scoped>
.text__block {
  &.expandable {
    max-height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 16px;
    transition: all 0.3s cubic-bezier(0.86, 0, 0.07, 1);

    &.expanded {
      max-height: 100vh;
      transition: all 0.3s cubic-bezier(0.86, 0, 0.07, 1);
    }
  }
}
</style>
