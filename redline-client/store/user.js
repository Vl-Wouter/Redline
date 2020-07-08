import { parseJWT } from '~/assets/js/utils'

export const state = () => ({
  current: null,
  token: null,
})

export const mutations = {
  setCurrent(state, user) {
    state.current = user
  },
  setToken(state, token) {
    state.token = token
  },
  addVehicleToUser(state, data) {
    state.current.vehicles.push(data)
  },
}

export const actions = {
  async signIn({ commit, dispatch }, authDetails) {
    const { data } = await this.$axios.post('/api/auth/signin', authDetails)
    const { id, fullName, roles, username } = parseJWT(data.accessToken)
    this.$axios.setToken(data.accessToken, 'Bearer')
    const { data: vehicles } = await this.$axios.get(`/api/vehicles/user/${id}`)
    commit('setCurrent', {
      id,
      fullName,
      roles,
      username,
      vehicles,
    })
    commit('setToken', data.accessToken)
  },
  signOut({ commit }) {
    commit('setCurrent', null)
    commit('setToken', null)
  },
  async addVehicle({ commit }, vehicle) {
    const { data } = await this.$axios.post('/api/vehicles', vehicle)
    commit('addVehicleToUser', data)
  },
}

export const getters = {
  getCurrent: (state) => {
    return state.current
  },
}
