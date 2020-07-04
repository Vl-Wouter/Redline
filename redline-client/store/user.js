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
}

export const actions = {
  async signIn({ commit, dispatch }, authDetails) {
    const { data } = await this.$axios.post('/api/auth/signin', authDetails)
    const userDetails = parseJWT(data.accessToken)
    commit('setCurrent', userDetails)
    this.$axios.setToken(data.accessToken)
    commit('setToken', data.accessToken)
  },
}

export const getters = {
  getCurrent: (state) => {
    return state.current
  },
}
