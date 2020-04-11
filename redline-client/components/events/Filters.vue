<template>
  <side-overlay ref="overlay" title="Filter Events" position="right" is-fill>
    <text-input
      v-model="filters.search"
      placeholder="Search..."
      name="searchTerm"
      @input.native="updateFilter"
    />
    <section class="filter__section">
      <h4>Category</h4>
      <toggle-input
        v-for="cat in categories"
        :key="cat.id"
        v-model="filters.categoryIds"
        :val="cat.id"
        :name="cat.name"
        :toggle-label="cat.name"
        @change.native="updateFilter"
      />
    </section>
    <section class="filter__section">
      <h4>Date</h4>
      <p>Between</p>
      <datetime
        v-model="filters.startDate"
        input-class="datetime__input"
        type="date"
      />
      <p>and</p>
      <datetime
        v-model="filters.endDate"
        input-class="datetime__input"
        type="date"
      />
    </section>
  </side-overlay>
</template>

<script>
import { Datetime } from 'vue-datetime'
import { TextInput, ToggleInput } from '../forms'
import SideOverlay from './SideOverlay'
export default {
  components: {
    SideOverlay,
    TextInput,
    ToggleInput,
    Datetime
  },
  data: () => ({
    filters: {
      search: '',
      categoryIds: [],
      startDate: new Date().toISOString(),
      endDate: ''
    }
  }),
  computed: {
    categories() {
      return this.$store.getters['events/getCategories']
    }
  },
  methods: {
    updateFilter() {
      this.$emit('filter', this.filters)
    },
    toggle() {
      this.$refs.overlay.toggleOverlay()
    }
  }
}
</script>

<style lang="scss" scoped>
.filter__section {
  margin: 16px 0;
}
</style>

<style lang="scss">
.vdatetime-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
}
</style>
