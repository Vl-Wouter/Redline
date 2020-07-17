const defaultState = {
  search: null,
  distance: {
    max: null,
    min: null,
  },
  type: [],
  date: {
    start: null,
    end: null,
  },
}

export const state = () => ({
  filters: {
    search: null,
    distance: {
      max: null,
      min: null,
    },
    type: [],
    date: {
      start: null,
      end: null,
    },
  },
})

export const mutations = {
  setFilters(state, filters) {
    state.filters = {
      ...state.filters,
      ...filters,
    }
  },
  clearFilters(state) {
    state.filters = defaultState
  },
}

export const actions = {
  applyFilters({ commit }, filters) {
    commit('setFilters', filters)
  },
  clearFilters({ commit, state }) {
    commit('clearFilters')
    return state.filters
  },
  filterEvents({ state }, events) {
    console.log(state.filters)
    return events
  },
}

export const getters = {
  getFilters: (state) => {
    return state.filters
  },
}
