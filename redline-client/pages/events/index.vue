<template>
  <div>
    <div v-if="events" class="eventContainer">
      <header>
        <h2>All Events</h2>
        <button><unicon name="filter" @click="toggleFilter" /></button>
      </header>
      <section v-if="Object.keys(events).length === 0">
        <p>There are no events here...</p>
      </section>
      <section v-for="(eventList, key) in events" :key="key">
        <h3>{{ key }}</h3>
        <nuxt-link
          v-for="(event, index) in eventList"
          :key="index"
          :to="`/events/${event.slug}`"
        >
          <small-event-card :event="event" />
        </nuxt-link>
      </section>
      <aside ref="filterContainer" class="filters out">
        <h3>Filters</h3>
        <form method="post">
          <div>
            <input
              type="text"
              name="searchTerm"
              id="searchTerm"
              placeholder="Search..."
              v-model="filterData.search"
              @input="filterEvents"
            />
          </div>
          <div>
            <p>Category</p>
            <div
              v-for="category in categories"
              :key="category.id"
              class="filters__categories"
            >
              <input
                type="checkbox"
                :name="category.name"
                :id="category.name"
                :value="category.id"
                v-model="filterData.categoryIds"
                @change="filterEvents"
              />
              <label :for="category.name">{{ category.name }}</label>
            </div>
          </div>
        </form>
      </aside>
    </div>
  </div>
</template>

<script>
import SmallEventCard from '~/components/cards/SmallEventCard'
export default {
  middleware: 'events',
  components: {
    SmallEventCard
  },
  data: () => ({
    events: null,
    filters: false,
    filterData: {
      search: '',
      categoryIds: [],
      startDate: '',
      endDate: ''
    }
  }),
  computed: {
    categories() {
      return this.$store.getters['events/getCategories']
    }
  },
  methods: {
    toggleFilter() {
      this.$refs.filterContainer.classList.toggle('out')
    },
    filterEvents() {
      const { search, categoryIds, startDate, endDate } = this.filterData
      let events = this.$store.getters['events/getAll']
      if (search) {
        events = events.filter(
          (event) =>
            event.title.includes(search) || event.description.includes(search)
        )
      }
      if (categoryIds.length > 0) {
        events = events.filter((event) =>
          categoryIds.includes(event.__category__.id)
        )
      }
      if (startDate) {
        events = events.filter(
          (event) =>
            new Date(event.startTime).getTime() > new Date(startDate).getTime()
        )
      }
      if (endDate) {
        events = events.filter(
          (event) =>
            new Date(event.startTime).getTime() < new Date(endDate).getTime()
        )
      }
      this.groupEvents(events)
    },
    groupEvents(events) {
      this.events = events.reduce((r, a) => {
        r[
          new Date(a.startTime).toLocaleString(undefined, {
            month: 'long',
            year: 'numeric'
          })
        ] = [
          ...(r[
            new Date(a.startTime).toLocaleString(undefined, {
              month: 'long',
              year: 'numeric'
            })
          ] || []),
          a
        ]
        return r
      }, {})
    }
  },
  mounted() {
    const events = this.$store.getters['events/getAll']
    this.groupEvents(events)
  }
}
</script>

<style lang="scss" scoped>
html,
body,
.main {
  overflow-x: hidden;
}

.eventContainer {
  position: relative;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  button {
    padding: 0;
    background: none;
    border: none;
    color: app-color();
    fill: app-color();
    cursor: pointer;
  }
}

.filters {
  position: fixed;
  top: 0;
  right: 0;
  background: app-color('background');
  width: auto;
  height: 100vh;
  padding: 16px;
  box-shadow: -5px 0 10px #00000020;

  input {
    border: none;
    background: none;
    padding: 8px 0;
    border-bottom: 1px solid #bcbcbc;
    width: 100%;
    font-size: 1rem;
    font-family: $base-font-family;
  }

  &__categories {
    display: flex;
    justify-content: flex-start;
    margin: 8px 0;

    input {
      width: auto;
      margin-right: 8px;
    }
  }

  &.out {
    transform: translateX(105%);
  }
}
</style>
