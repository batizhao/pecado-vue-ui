import MyBacklog from './MyBacklog'
import UsedProcess from './UsedProcess'
import Notice from './Notice'
import StackedLine from './StackedLine'
import BarBase from './BarBase'
import HeaderBar from './HeaderBar'
import NavBar from './NavBar'
import FooterBar from './FooterBar'
import UpFrame from './UpFrame'
import FormContainer from './FormContainer'
import ListContainer from './ListContainer'
import PageContainer from './PageContainer'
import EventButton from './EventButton/index.vue'
import Tinymce from './tinymce/index.vue'
import objectSelector from './object-selector/index.vue'
import objectCascader from './object-cascader/index.vue'
import objectCheckboxGroup from './object-checkbox-group/index.vue'
import objectRadioGroup from './object-radio-group/index.vue'
import timeRangePicker from './time-range-picker/index.vue'
import dateRangePicker from './date-range-picker/index.vue'
import fileUpload from './fileUpload/index.vue'
import HtmlInterpreter from './HtmlInterpreter'
Vue.component(MyBacklog.name, MyBacklog)
Vue.component(UsedProcess.name, UsedProcess)
Vue.component(Notice.name, Notice)
Vue.component(StackedLine.name, StackedLine)
Vue.component(BarBase.name, BarBase)
Vue.component(HeaderBar.name, HeaderBar)
Vue.component(NavBar.name, NavBar)
Vue.component(FooterBar.name, FooterBar)
Vue.component(UpFrame.name, UpFrame)
Vue.component(FormContainer.name, FormContainer)
Vue.component(ListContainer.name, ListContainer)
Vue.component(PageContainer.name, PageContainer)
Vue.component(EventButton.name, EventButton)
Vue.component('tinymce', Tinymce)
Vue.component('object-selector', objectSelector)
Vue.component('object-cascader', objectCascader)
Vue.component('object-checkbox-group', objectCheckboxGroup)
Vue.component('object-radio-group', objectRadioGroup)
Vue.component('time-range-picker', timeRangePicker)
Vue.component('date-range-picker', dateRangePicker)
Vue.component('file-upload', fileUpload)
Vue.component('html-interpreter', HtmlInterpreter)

