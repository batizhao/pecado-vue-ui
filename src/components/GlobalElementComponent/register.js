import Vue from 'vue'

// 全局二次封装elmenment组件
import ActionButton from './actionButton.vue'
import ActionDialog from './actionDialog.vue'
import ActionForm from './actionForm.vue'
import ActionTable from './actionTable.vue'
import ActionDropdown from './actionDropdown.vue'
import ActionEditTable from './actionEditTable.vue'

Vue.component('ActionButton', ActionButton)
Vue.component('ActionDialog', ActionDialog)
Vue.component('ActionForm', ActionForm)
Vue.component('ActionTable', ActionTable)
Vue.component('ActionDropdown', ActionDropdown)
Vue.component('ActionEditTable', ActionEditTable)
