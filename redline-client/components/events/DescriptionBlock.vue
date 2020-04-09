<template>
  <section class="description">
    <section
      ref="description"
      class="text__block"
      :class="{ expandable, expanded }"
      v-html="sanitizedContent"
    ></section>
    <button v-if="isExpandable" @click="toggleContent">
      Read {{ expanded ? 'less' : 'more' }}
    </button>
  </section>
</template>

<script>
export default {
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
  data: () => ({
    expanded: false,
    isExpandable: false
  }),
  computed: {
    sanitizedContent() {
      return this.$sanitize(this.content)
    }
  },
  mounted() {
    this.$nextTick(function() {
      const element = this.$refs.description
      this.isExpandable = element.offsetHeight < element.scrollHeight
    })
  },
  methods: {
    toggleContent() {
      this.expanded = !this.expanded
    }
  }
}
</script>

<style lang="scss" scoped>
.description {
  padding: 0 16px;
}
.text__block {
  &.expandable {
    line-height: 1.4em;
    max-height: (1.4 * 3) * 1em;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    margin-bottom: 16px;
    transition: all 0.3s cubic-bezier(0.86, 0, 0.07, 1);

    &.expanded {
      max-height: 100vh;
      transition: all 0.3s cubic-bezier(0.86, 0, 0.07, 1);
    }
  }
}
</style>
