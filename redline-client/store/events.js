export const state = () => ({
  all: [],
  categories: null,
  lastFetch: 0
})

export const mutations = {
  setEvents(state, events) {
    state.all = events
    state.lastFetch = Date.now()
  },
  setCategories(state, categories) {
    state.categories = categories
    state.lastFetch = Date.now()
  },
  addEvent(state, event) {
    state.all.push(event)
  }
}

export const actions = {
  async fetchEvents({ commit }) {
    const { data: events } = await this.$axios.get('/events')
    commit('setEvents', events)
  },
  async fetchCategories({ commit }) {
    const { data: categories } = await this.$axios.get('/categories')
    commit('setCategories', categories)
  }
}

export const getters = {
  getAll: (state) => {
    return state.all
      .filter((event) => {
        return (
          new Date(event.startTime).getTime() > new Date().getTime() ||
          new Date(event.endTime) > new Date().getTime()
        )
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  },
  getBySlug: (state) => (slug) => {
    return state.all.find((event) => event.slug === slug)
  },
  getCategories: (state) => {
    return state.categories
  }
}
