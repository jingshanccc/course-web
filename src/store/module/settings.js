import Config from '@/settings'
const { title, footerText, caseNumber } = Config

const state = {
  title: title,
  footerText: footerText,
  caseNumber: caseNumber
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
