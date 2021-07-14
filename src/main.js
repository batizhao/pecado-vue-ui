import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import D2Crud from '@d2-projects/d2-crud'

import './assets/icons' // icon
import './permission' // permission control
import { listDictDataByCode } from "@/api/system/dict/data";
// import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar"

import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zh from './assets/languages/zh'
import en from './assets/languages/en'

// 全局方法挂载
Vue.prototype.listDictDataByCode = listDictDataByCode
// Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(permission)

Vue.use(VueI18n)
Vue.use(D2Crud)

const messages = {
  'en': {
    ...en,
    ...enLocale // 或者用 Object.assign({ message: 'hello' }, enLocale)
  },
  'zh': {
    ...zh,
    ...zhLocale // 或者用 Object.assign({ message: '你好' }, zhLocale)
  },
  'en-US': {
    ...en,
    ...enLocale // 或者用 Object.assign({ message: 'hello' }, enLocale)
  },
  'zh-CN': {
    ...zh,
    ...zhLocale // 或者用 Object.assign({ message: '你好' }, zhLocale)
  },
}
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'zh-CN', // set locale
  messages, // set locale messages
})

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */



Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
