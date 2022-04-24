export default {
  namespaced: true,
  state: {
    navbarShow: true
  },
  mutations: {
    setNavbarShow (state, value) {
      state.navbarShow = value
    }
  }
}