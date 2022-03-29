import { isNumberStr } from '../../../utils/index'
import store from '@/store'
function setDefaultValue (val) {
  if (Array.isArray(val)) {
    return val.join(',')
  }
  // if (['string', 'number'].indexOf(typeof val) > -1) {
  //   return val
  // }
  if (typeof val === 'boolean') {
    return `${val}`
  }
  return val
}
function onDefaultValueInput (str) {
  let defaultValue
  if (Array.isArray(this.activeData.__config__.defaultValue)) {
    // 数组
    defaultValue = str.split(',').map(val => (isNumberStr(val) ? +val : val))
  } else if (['true', 'false'].indexOf(str) > -1) {
    // 布尔

    defaultValue = JSON.parse(str)
  } else {
    // 字符串和数字
    defaultValue = isNumberStr(str) ? +str : str
  }
  store.commit('codeEditor/components/setDefaultValue', defaultValue)
}
export {
  setDefaultValue,
  onDefaultValueInput
}
