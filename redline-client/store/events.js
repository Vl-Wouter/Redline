export const state = () => ({
  all: null,
  categories: null
})

export const mutations = {
  setEvents(state, events) {
    state.all = events
  },
  setCategories(state, categories) {
    state.categories = categories
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
    return state.all.filter((event) => {
      return (
        new Date(event.startTime).getTime() > new Date().getTime() ||
        new Date(event.endTime) > new Date().getTime()
      )
    })
  },

  getCategories: (state) => {
    return state.categories
  }
}
