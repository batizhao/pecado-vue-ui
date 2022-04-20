<template>
  <div class="container">
    <div class="left-board" v-show="leftBordShow">
      <div class="logo-wrapper">
        <div class="logo">
          <!-- {{ formInfo.formName }} -->
        </div>
      </div>
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <template v-for="(item, listIndex) in leftComponents">
            <div v-if="true || item.formTypes.includes(formInfo.formType)" :key="listIndex">
              <div class="components-title">
                <svg-icon icon-class="component" />
                {{ item.title }}
              </div>
              <draggable
                class="components-draggable"
                :list="item.list"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="cloneComponent"
                draggable=".components-item"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in item.list"
                  :key="index"
                  class="components-item"
                  @click="addComponent(element)"
                >
                  <div class="components-body">
                    <svg-icon :icon-class="element.__config__.tagIcon" />
                    {{ element.__config__.label }}
                  </div>
                </div>
              </draggable>
            </div>
          </template>
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <div class="action-bar">
        <div class="close-or-open" @click="leftBordShow = !leftBordShow" title="收起/展开 左侧面板">
          <i :class="leftBordShow ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i>
        </div>
        <div class="close-or-open right"  @click="rightBordShow = !rightBordShow" title="收起/展开 右侧面板">
          <i :class="!rightBordShow ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i>
        </div>
        <el-button icon="el-icon-video-play" type="text" :loading="saveLoading" @click="save">
          保存
        </el-button>
        <!-- <el-button icon="el-icon-video-play" type="text" @click="run">
          运行
        </el-button> -->
        <el-button icon="el-icon-view" type="text" @click="showJson">
          查看json
        </el-button>
        <!-- <el-button icon="el-icon-download" type="text" @click="download">
          导出vue文件
        </el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
          复制代码
        </el-button> -->
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
          清空
        </el-button>
      </div>
      <div class="center-scollbar-container" v-loading="saveLoading">
        <el-scrollbar class="center-scrollbar center-scrollbar-editor">
          <el-row class="center-board-row page-root" :gutter="formConf.gutter">
            <el-form
              :size="formConf.size"
              :label-position="formConf.labelPosition"
              :disabled="formConf.disabled"
              :label-width="formConf.labelWidth + 'px'"
            >
              <draggable
                class="drawing-board flex-start-wrap"
                :list="drawingList"
                :animation="340"
                group="componentsGroup"
                @end="drawingItemEnd"
              >
                <draggable-item
                  v-for="(item, index) in drawingList"
                  :key="item.__config__.renderKey"
                  :drawing-list="drawingList"
                  :current-item="item"
                  :index="index"
                  :active-id="activeId"
                  :form-conf="formConf"
                  @activeItem="activeFormItem"
                  @copyItem="drawingItemCopy"
                  @deleteItem="drawingItemDelete"
                />
              </draggable>
              <div v-show="!drawingList.length" class="empty-info">
                从左侧拖入或点选组件进行表单设计
              </div>
            </el-form>
          </el-row>
        </el-scrollbar>
      </div>
    </div>

    <right-panel :show-field="!!drawingList.length" @tag-change="tagChange" v-show="rightBordShow" />

    <form-drawer
      :visible.sync="drawerVisible"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    />
    <json-drawer
      size="60%"
      :visible.sync="jsonDrawerVisible"
      :json-str="JSON.stringify(formData)"
      @refresh="refreshJson"
    />
    <code-type-dialog
      :visible.sync="dialogVisible"
      title="选择生成类型"
      :show-file-name="showFileName"
      @confirm="generate"
    />
    <input id="copyNode" type="hidden" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import '../../icons'
import draggable from 'vuedraggable'
import { saveAs } from 'file-saver'
import ClipboardJS from 'clipboard'
import FormDrawer from './FormDrawer'
import JsonDrawer from './JsonDrawer'
import RightPanel from './RightPanel'
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  echartsComponents,
  seniorComponents
} from '../../components/generator/config'
import {
  beautifierConf,
  titleCase,
  deepClone,
  isObjectObject
} from '../../utils/index'
import { makeUpHtml, vueTemplate, vueScript, cssStyle } from '../../components/generator/html'
import { makeUpJs } from '../../components/generator/js'
import { makeUpCss } from '../../components/generator/css'
import CodeTypeDialog from './CodeTypeDialog'
import DraggableItem from './DraggableItem'
import loadBeautifier from '../../utils/loadBeautifier'
import { addOneNodeStyleToDocument } from '../../components/parser/addStyleToDocument.js'
let beautifier
let tempActiveData

export default {
  components: {
    draggable,
    FormDrawer,
    JsonDrawer,
    RightPanel,
    CodeTypeDialog,
    DraggableItem
  },
  props: {
    saveLoading: Boolean,
    formInfo: Object,
    leftComponents: {
      type: Array,
      default: () => [
        {
          title: '输入型组件',
          list: inputComponents
        },
        {
          title: '选择型组件',
          list: selectComponents
        },
        {
          title: '布局型组件',
          list: layoutComponents
        },
        {
          title: '高级组件',
          list: seniorComponents
        }

      ]
    }
  },
  data () {
    return {
      idGlobal: '',
      // formConf,
      inputComponents,
      selectComponents,
      layoutComponents,
      echartsComponents,
      labelWidth: 100,
      drawingData: {},
      activeId: '',
      drawerVisible: false,
      // formData: {},
      dialogVisible: false,
      jsonDrawerVisible: false,
      generateConf: null,
      showFileName: false,
      resetIdGlobalNum: 0,
      leftBordShow: true,
      rightBordShow: true
    }
  },
  computed: {
    ...mapState('codeEditor/components', ['formConf', 'formData', 'activeIndex', 'drawingList'])
  },
  mounted () {
    loadBeautifier((btf) => {
      beautifier = btf
    })
    const clipboard = new ClipboardJS('#copyNode', {
      text: (trigger) => {
        const codeStr = this.generateCode()
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        })
        return codeStr
      }
    })
    clipboard.on('error', (e) => {
      this.$message.error('代码复制失败')
    })
  },
  methods: {
    ...mapMutations('codeEditor/components', [
      'setFormData',
      'setFormConf',
      'setActiveIndex',
      'addDrawingList',
      'setDrawingList'
    ]),
    setObjectValueReduce (obj, strKeys, data) {
      const arr = strKeys.split('.')
      arr.reduce((pre, item, i) => {
        if (arr.length === i + 1) {
          pre[item] = data
        } else if (!isObjectObject(pre[item])) {
          pre[item] = {}
        }
        return pre[item]
      }, obj)
    },
    setLoading (component, val) {
      const { directives } = component

      if (Array.isArray(directives)) {
        const t = directives.find((d) => d.name === 'loading')
        if (t) t.value = val
      }
    },

    activeFormItem (item) {
      if (item && item.__config__) {
        this.activeId = item.__config__.formId
        const activeIndex = this.findOffset(this.drawingList, item.__config__.renderKey)
        this.setActiveIndex(activeIndex)
      }
    },

    findOffset (drawingList, val, position) {
      let res = ''
      function _find (arr, val, position) {
        let temp = ''
        arr.forEach((item, index) => {
          temp = position !== undefined ? position + ',' + index : index
          if (item.__config__.renderKey === val) {
            res = temp
          } else if (item.__config__.children instanceof Array) {
            temp = _find(item.__config__.children, val, temp)
          }
        })
      }
      _find(drawingList, val, position)
      return res.toString().split(',')
    },
    onEnd (obj) {
      if (obj.from !== obj.to) {
        this.activeId = this.idGlobal
      }
    },
    addComponent (item) {
      const clone = this.cloneComponent(item)
      this.addDrawingList(clone)
      this.activeFormItem(clone)
      addOneNodeStyleToDocument(clone) // 给组件添加样式
    },
    cloneComponent (origin) {
      const clone = deepClone(origin)
      this.createIdAndKey(clone)
      tempActiveData = clone
      return tempActiveData
    },
    createIdAndKey (item) {
      const config = item.__config__
      this.resetIdGlobal(this.resetIdGlobalNum++)
      config.formId = this.idGlobal
      config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
      item.assemblyStatus = false
      if (config.layout === 'rowFormItem') {
        config.componentName = `row${this.idGlobal}`
      } else {
        item.__vModel__ = `field${this.idGlobal}` // 除了行容器 其他组件都把vModel加上
      }
      // 如果有children
      if (Array.isArray(config.children)) {
        config.children.map((childItem) => {
          this.createIdAndKey(childItem)
        })
      } else {
        config.children = []
      }
      return item
    },
    AssembleFormData () {
      this.setFormData({
        ...this.formConf,
        fields: deepClone(this.drawingList)
      })
    },
    generate (data) {
      const func = this[`exec${titleCase(this.operationType)}`]
      this.generateConf = data
      func && func(data)
    },
    execRun (data) {
      this.AssembleFormData()
      this.drawerVisible = true
    },
    execDownload (data) {
      const codeStr = this.generateCode()
      const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, data.fileName)
    },
    execCopy (data) {
      document.getElementById('copyNode').click()
    },
    empty () {
      this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(() => {
        this.setDrawingList([])
      })
    },
    resetIdGlobal (num = 0) {
      this.idGlobal = Number(new Date().getTime() - 1642560259070 + num).toString(16)
    },
    drawingItemEnd () {
      const data = deepClone(this.$store.getters['codeEditor/components/getCurrentComponent'] || null)
      this.activeFormItem(data)
    },
    drawingItemCopy (item, list) {
      let clone = deepClone(item)
      clone = this.createIdAndKey(clone)
      list.push(clone)
      this.activeFormItem(item)
      addOneNodeStyleToDocument(clone) // 给组件添加样式
    },
    drawingItemDelete (index, list) {
      this.$nextTick(() => {
        list.splice(index, 1)
        this.activeFormItem(index > 0 ? list[index - 1] : list[0])
      })
    },
    generateCode () {
      const { type } = this.generateConf
      this.AssembleFormData()
      const script = vueScript(makeUpJs(this.formData, type))
      const html = vueTemplate(makeUpHtml(this.formData, type))
      const css = cssStyle(makeUpCss(this.formData))
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    showJson () {
      this.AssembleFormData()
      this.jsonDrawerVisible = true
    },
    save () {
      this.AssembleFormData()
      // 提交数据
      // JS,CSS,HTML,JSON
      this.$emit('save', this.formData)
    },
    // 清空所有组件
    clearAll () {
      this.drawingList = []
    },

    download () {
      this.dialogVisible = true
      this.showFileName = true
      this.operationType = 'download'
    },
    run () {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'run'
    },
    copy () {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'copy'
    },
    tagChange (newTag) {
      newTag = this.cloneComponent(newTag)
      const config = newTag.__config__
      newTag.__vModel__ = this.activeData.__vModel__
      config.formId = this.activeId
      config.span = this.activeData.__config__.span
      this.activeData.__config__.tag = config.tag
      this.activeData.__config__.tagIcon = config.tagIcon
      this.activeData.__config__.document = config.document
      if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
        config.defaultValue = this.activeData.__config__.defaultValue
      }
      Object.keys(newTag).forEach((key) => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key]
        }
      })
      this.activeData = newTag
      this.updateDrawingList(newTag, this.drawingList)
    },
    updateDrawingList (newTag, list) {
      const index = list.findIndex((item) => item.__config__.formId === this.activeId)
      if (index > -1) {
        list.splice(index, 1, newTag)
      } else {
        list.forEach((item) => {
          if (Array.isArray(item.__config__.children)) { this.updateDrawingList(newTag, item.__config__.children) }
        })
      }
    },
    refreshJson (data) {
      this.setDrawingList(deepClone(data.fields))
      delete data.fields
      this.formConf = data
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/home.scss';
</style>
