import { parseJWT } from '@/assets/js/util.js'

export const state = () => ({
  current: null,
  settingsData: null,
  vehicles: []
})

export const mutations = {
  setUser(state, user) {
    state.current = user
  },
  signOut(state) {
    state.current = null
  },
  setData(state, data) {
    state.settingsData = data
  },
  setVehicles(state, data) {
    state.vehicles = data
  },
  addVehicleToList(state, data) {
    state.vehicles.push(data)
  }
}

export const actions = {
  async signIn({ commit, dispatch }, authDetails) {
    const { data } = await this.$axios.post('/auth/signin', authDetails)
    const userDetails = parseJWT(data.accessToken)
    dispatch('getUserVehicles', userDetails.id)
    commit('setUser', {
      token: data.accessToken,
      ...userDetails
    })
  },
  async getUserVehicles({ commit }, userId) {
    const { data: vehicles } = await this.$axios.get(`/vehicles/user/${userId}`)
    commit('setVehicles', vehicles)
  },
  async getUserData({ state, commit }) {
    const { data } = await this.$axios.get(
      `/auth/${state.current.username}/all`
    )
    commit('setData', data)
  },
  async updateAvatar({ state, commit }, data) {
    const { data: updatedUser } = await this.$axios.post(
      `/auth/${state.current.username}/avatar`,
      data
    )
    commit('setData', updatedUser)
  },
  async updateUser({ state, commit }, data) {
    const { data: updatedUser } = await this.$axios.patch(
      `/auth/${state.current.username}`,
      data
    )
    commit('setData', updatedUser)
  },
  async addVehicle({ state, commit }, data) {
    const { data: addedVehicle } = await this.$axios.post('/vehicles', data)
    commit('addVehicleToList', addedVehicle)
  }
}

export const getters = {
  getUser: (state) => {
    return state.current
  },
  getSettingsData: (state) => {
    return state.settingsData
  },
  getEventSettings: (state) => {
    return state.settingsData.ownEvents
  },
  getVehicles: (state) => {
    return state.vehicles
  }
}
