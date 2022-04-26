<template>
  <div v-if="formConf ? formConf.__methods__ : activeData.on">
    <el-divider>事件</el-divider>
    <ul class="event-setting-buttons">
      <li v-for="(value, key, index) in formConf ? formConf.__methods__ : activeData.__methods__" :key="index">
        <span>{{key}}</span>
        <el-button icon="el-icon-edit" size="mini" @click="writeFunction(value, key)">编写</el-button>
      </li>
    </ul>
    <action-dialog v-model="editorVisible" @confirm="editorConfirm" width="80%">
      <div class="editor-start-end">
        {{formConf ? 'form' : activeData.__vModel__}}.{{eventName}}({{params}}) {
      </div>
      <div :id="editorId" style="height: 400px;" />
      <div class="editor-start-end">}</div>
      <template v-slot:title>
        <span>{{eventName + '事件'}} </span>
        <el-tooltip placement="top" effect="light">
          <div slot="content">
            <h4>基础组件API</h4>
            <ol class="event-tips">
              <li>
                <span>获取值</span>
                <span>this.getValue(field)</span>
              </li>
              <li>
                <span>设置值</span>
                <span>this.setValue(field, value)</span>
              </li>
              <li>
                <span>设置默认值</span>
                <span>this.setDefaultValue(field, value)</span>
              </li>
              <li>
                <span>设置禁用</span>
                <span>this.setDisabled(field, value)</span>
              </li>
              <li>
                <span>设置只读</span>
                <span>this.setReadOnly(field, value)</span>
              </li>
              <li>
                <span>设置隐藏</span>
                <span>this.setHidden(field, value)</span>
              </li>
              <li>
                <span>设置必填</span>
                <span>this.setRequired(field, value)</span>
              </li>
              <li>
                <span>设置指定属性值</span>
                <span>this.setOption(field, key, value)</span>
              </li>
            </ol>
            <h4>子表单组件API</h4>
            <ol class="event-tips">
              <li>
                <span>设置值</span>
                <span>this.setValue(index, attrName, value)</span>
              </li>
            </ol>
            <h4>用户API</h4>
            <ol class="event-tips">
              <li>
                <span>获取当前用户信息</span>
                <span>const user = this.getUserInfo()</span>
              </li>
              <li>
                <span>用户姓名</span>
                <span>user.name</span>
              </li>
              <li>
                <span>用户名</span>
                <span>user.username</span>
              </li>
              <li>
                <span>用户所在部门Id集合</span>
                <span>user.departmentId</span>
              </li>
              <li>
                <span>用户角色编码集合</span>
                <span>user.roleCode</span>
              </li>
              <li>
                <span>用户权限标识集合</span>
                <span>user.permissions</span>
              </li>
              <li>
                <span>用户邮箱</span>
                <span>user.email</span>
              </li>
            </ol>
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </template>

    </action-dialog>
  </div>
</template>

<script>
import mixins from './mixins'
import loadMonaco from '../../../utils/loadMonaco'
let monaco
export default {
  mixins: [mixins],
  props: {
    formConf: Object // 有这个参数就代表是表单的事件，否则就是组件的事件
  },
  data () {
    return {
      editorVisible: false,
      editorStr: '',
      eventName: '',
      editorId: 'editorJs' + Math.floor(Math.random() * 10000)
    }
  },
  watch: {
    '$store.state.codeEditor.components.activeIndex': function (val, old) {
      if (String(val) !== String(old)) {
        this.setMethods()
      }
    }
  },
  computed: {
    params () {
      if (this.formConf) return ''
      if (['onClear', 'onMounted'].includes(this.eventName)) {
        // 有些事件没有参数，比如onClear
        return ''
      } else if (this.activeData.__config__.parentTag === 'subform-table') {
        // 子表单组件的子组件事件有两个参数
        return 'value, index'
      } else {
        return 'value'
      }
    }
  },
  created () {
    this.setMethods()
  },
  methods: {
    // 初始化__methods__的值
    setMethods () {
      if (this.formConf) return
      if (!this.activeData.__methods__) {
        const onEvents = this.activeData.on
        if (onEvents) {
          const methods = {}
          Object.values(onEvents).map(value => {
            methods[value] = ''
          })
          // 默认全部加上onMounted事件，然后在Parser中收集所有onMounted事件依次执行
          methods.onMounted = ''
          this.$set(this.activeData, '__methods__', methods)
        }
      }
    },
    writeFunction (value, key) {
      this.editorStr = value
      this.eventName = key
      this.editorVisible = true
      this.$nextTick(() => {
        this.onOpen()
      })
    },
    onOpen() {
      loadMonaco(val => {
        monaco = val
        this.setEditorValue(this.editorId, this.editorStr)
      })
    },
    setEditorValue(id, codeStr) {
      if (this.jsonEditor) {
        this.jsonEditor.setValue(codeStr)
      } else {
        this.jsonEditor = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: 'javascript',
          automaticLayout: true
        })
      }
    },
    editorConfirm() {
      let value = this.jsonEditor.getValue()
      if (/^[\s]+$/.test(value)) { // 如果全是空白符
        value = ''
      }
      if (this.formConf) {
        this.formConf.__methods__[this.eventName] = value
      } else {
        this.activeData.__methods__[this.eventName] = value
      }
      this.editorVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.event-setting-buttons {
  li {
    display: flex;
    justify-content: space-between;
    padding: 5px 7%;
  }
}
.editor-start-end {
  font-size: 14px;
  padding: 7px;
  background: #1e1e1e;
  color: #fff;
  letter-spacing: 1px;
}
.event-tips {
  li {
    margin-bottom: 5px;
    & > span:first-child {
      margin-right: 10px;
    }
  }
}
</style>