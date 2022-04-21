
export default {
  namespaced: true,
  state: {
    formData: {}, // 包含drawingList formConf
    drawingList: [],
    activeIndex: [],
    formConf: {},
    currentComponet: null, // 当前选择的对象
    formResetTimeStamp: 0, // 表格是否点击了重置按钮的标识，用时间戳更新并监听
  },
  getters: {
    getCurrentComponent: state => {
      const list = state.drawingList
      let result = null
      state.activeIndex.map((currentIndex, index) => {
        if (index === 0) {
          result = list[currentIndex]
        } else {
          if (result.__config__.tag === 'layout-table') {
            result = result.layoutTableData[currentIndex[0]][currentIndex[1]]
          } else {
            result = result.__config__.children[currentIndex]
          }
        }
      })
      return result
    }
  },
  mutations: {
    setFormData (state, formData) {
      state.formData = formData
    },
    setActiveIndex (state, activeIndex) {
      state.activeIndex = activeIndex
    },
    addDrawingList (state, item) {
      state.drawingList.push(item)
    },
    setDrawingList (state, drawingList) {
      state.drawingList = drawingList
    },
    setActiveComponent (state, payload) {
      const arr = state.activeIndex
      let list = state.drawingList
      if (arr.length === 1) {
        list = list[arr[0]]
      } else {
        arr.forEach((key, index) => {
          if (index === arr.length - 1) {
            list = list[key]
          } else {
            list = list[key].__config__.children
          }
        })
      }
      list = payload
    },
    changeRenderKey (state) {
      const times = new Date().getTime().toString()
      this.getters['codeEditor/components/getCurrentComponent'].__config__.renderKey = times
    },
    setFormConf (state, payload) {
      state.formConf = payload
    },
    spanChange (state, payload) {
      state.formConf.span = payload
    },
    setDefaultValue (state, payload) {
      this.getters['codeEditor/components/getCurrentComponent'].__config__.defaultValue = payload
    },
    setFormResetTimeStamp (state) {
      state.formResetTimeStamp = new Date().getTime()
    }
  }
}
