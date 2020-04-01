import { parseJWT } from '@/assets/js/util.js'

export const state = () => ({
  current: null
})

export const mutations = {
  setUser(state, user) {
    state.current = user
  }
}

export const actions = {
  async signIn({ commit }, authDetails) {
    const { data } = await this.$axios.post('/auth/signin', authDetails)
    commit('setUser', {
      token: data.accessToken,
      ...parseJWT(data.accessToken)
    })
  }
}
