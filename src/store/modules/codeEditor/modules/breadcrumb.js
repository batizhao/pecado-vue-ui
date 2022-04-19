export default {
  namespaced: true,
  state: {
    breadcrumbNames: [
      {
        name: '导航一',
        search: ''
      },
      {
        name: '导航二',
        search: ''
      }
    ]
  },
  mutations: {
    // 设置
    setBreadcrumbNames (state, items) {
      state.breadcrumbNames = items
    },
    // 追加
    appendBreadcrumbNames (state, item) {
      state.breadcrumbNames.push(item)
    },
    // 回退
    popBreadcrumbNames (state) {
      state.breadcrumbNames.pop()
    }
  }
}