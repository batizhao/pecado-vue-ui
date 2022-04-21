import store from '@/store'

function ifStringify (val) {
  const type = typeof val
  return ['object', 'boolean'].includes(type)
}

function getDefaultValue (val) {
  if (ifStringify(val)) {
    return JSON.stringify(val)
  }
  return val
}
function setDefaultValue (val) {
  let defaultValue
  if (ifStringify(this.activeData.__config__.defaultValue)) {
    defaultValue = JSON.parse(val)
  } else {
    defaultValue = val
  }
  store.commit('codeEditor/components/setDefaultValue', defaultValue)

}
export {
  setDefaultValue,
  getDefaultValue
}
