import { parseJWT } from '@/assets/js/util.js'

export const state = () => ({
  current: null,
  settingsData: null
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
  }
}

export const actions = {
  async signIn({ commit }, authDetails) {
    const { data } = await this.$axios.post('/auth/signin', authDetails)
    commit('setUser', {
      token: data.accessToken,
      ...parseJWT(data.accessToken)
    })
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
  }
}
