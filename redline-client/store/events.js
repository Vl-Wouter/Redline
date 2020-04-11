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
  },
  updateEvent(state, { id, data }) {
    const index = state.all.findIndex((event) => event.id === id)
    state.all.splice(index, 1, data)
  },
  addReview(state, review) {
    const index = state.all.findIndex((event) => event.id === review.eventId)
    state.all[index].reviews.push(review)
    const newState = state.all[index]
    state.all.splice(index, 1, newState)
  },
  removeReview(state, review) {
    const index = state.all.findIndex((event) => event.id === review.eventId)
    const event = state.all[index]
    event.reviews = event.reviews.filter((item) => item.id !== review.id)
    state.all.splice(index, 1, event)
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
  },
  async removeReview({ commit }, review) {
    await this.$axios.delete(`/reviews/${review.id}`)
    commit('removeReview', review)
  },
  async addReview({ state, commit }, reviewData) {
    const { data: review } = await this.$axios.post(`/reviews`, reviewData)
    commit('addReview', review)
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
