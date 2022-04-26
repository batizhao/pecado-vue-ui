export default {
  namespaced: true,
  state: {
    processConfig: null
  },
  mutations: {
    setProcessConfig (state, val) {
      state.processConfig = val
    }
  }
}