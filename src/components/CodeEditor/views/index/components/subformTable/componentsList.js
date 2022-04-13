import { inputComponents, selectComponents } from '@/components/CodeEditor/components/generator/config.js'
function getList () {
  const list = inputComponents
    .concat(selectComponents)
    .filter(item => {
      // 过滤掉编辑器组件
      return item.__config__.tag !== 'tinymce'  
    })
  return list
}
function getGlobalId () {
  return Number(new Date().getTime() - 1642560259070).toString(16)
}
// 获取可以渲染到子表单表格的组件列表
export function getComponentsList () {
  return getList().map(item => ({
    label: item.__config__.label,
    value: item.__config__.componentCode
  }))
}
// 根据componentCode查询组件
export function getComponent (componentCode) {
  const obj = getList().find(item => item.__config__.componentCode === componentCode) || null
  if (obj) {
    const config = obj.__config__
    config.formId = getGlobalId()
    config.renderKey = `${config.formId}${+new Date()}`
    obj.__vModel__ = `field${config.formId}`
  }
  return obj
}



