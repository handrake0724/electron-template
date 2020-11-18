import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    preferences: {},
    projectPath: null,
    projectContents: {}
  },
  mutations: {
    updatePreferences (state, newPreferences) {
      state.preferences = newPreferences
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getPreferences (state) {
      return state.preferences
    }
  }
})
