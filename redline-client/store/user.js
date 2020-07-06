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
    this.$axios.setToken(data.accessToken, 'Bearer')
    commit('setToken', data.accessToken)
  },
  signOut({ commit }) {
    commit('setCurrent', null)
    commit('setToken', null)
  },
}

export const getters = {
  getCurrent: (state) => {
    return state.current
  },
}
