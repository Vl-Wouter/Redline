<template>
  <section>
    <section
      class="text__block"
      :class="{ expandable, expanded }"
      v-html="sanitizedContent"
      ref="description"
    ></section>
    <button v-if="isExpandable" @click="toggleContent">
      Read {{ expanded ? 'less' : 'more' }}
    </button>
  </section>
</template>

<script>
export default {
  data: () => ({
    expanded: false,
    isExpandable: false
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
  },
  mounted() {
    this.$nextTick(function() {
      const element = this.$refs.description
      this.isExpandable = element.offsetHeight < element.scrollHeight
    })
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
