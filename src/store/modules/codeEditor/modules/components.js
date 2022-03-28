
export default {
  namespaced: true,
  state: {
    formData: {}, // 包含drawingList formConf
    drawingList: [],
    activeIndex: [],
    formConf: {},
    currentComponet: null, // 当前选择的对象
    renderModels: [], // 表格需要刷新数据时，存储要更新的组件的__vModel__
    formResetTimeStamp: 0, // 表格是否点击了重置按钮的标识，用时间戳更新并监听
    renderNums: 0, // 批量新增表格组件 通过监听此值变化来提交表格数据
    parseRenderKey: 0, // 通过监听renderKey来实现组件之间联动 (重新渲染parse)
    currentFormId: 0 // 监听此值来实现点击组件跳转到对应的表单页面
  },
  getters: {
    getCurrentComponent: state => {
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
      return list
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
    setRenderModels (state, renderModels) {
      state.renderModels = renderModels
    },
    changeParseRenderKey (state) {
      state.parseRenderKey = new Date().getTime().toString()
    },
    setCurrentFormId (state, currentFormId) {
      state.currentFormId = currentFormId
    },
    setRenderNums (state, renderNums) {
      state.renderNums = renderNums
    },
    setFormResetTimeStamp (state) {
      state.formResetTimeStamp = new Date().getTime()
    }
  }
}
