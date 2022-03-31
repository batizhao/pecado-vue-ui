<template>
  <div v-if="activeData.on">
    <el-divider>事件</el-divider>
    <ul class="event-setting-buttons">
      <li v-for="(value, key, index) in activeData.__methods__" :key="index">
        <span>{{key}}</span>
        <el-button icon="el-icon-edit" size="mini" @click="writeFunction(value, key)">编写</el-button>
      </li>
    </ul>
    <action-dialog v-model="editorVisible" title="" @confirm="editorConfirm">
      <div class="editor-start-end">{{activeData.__vModel__}}.{{eventName}}({{params}}) {</div>
      <div id="editorJs" style="height: 400px;" />
      <div class="editor-start-end">}</div>
    </action-dialog>
  </div>
</template>

<script>
import mixins from './mixins'
import loadMonaco from '../../../utils/loadMonaco'
let monaco
export default {
  mixins: [mixins],
  data () {
    return {
      editorVisible: false,
      editorStr: '',
      eventName: ''
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
      // 有些事件没有参数，比如onClear
      return (['onClear'].includes(this.eventName)) ? '' : 'value'
    }
  },
  created () {
    this.setMethods()
  },
  methods: {
    // 初始化__methods__的值
    setMethods () {
      if (!this.activeData.__methods__) {
        const onEvents = this.activeData.on
        if (onEvents) {
          const methods = {}
          Object.values(onEvents).map(value => {
            methods[value] = ''
          })
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
        this.setEditorValue('editorJs', this.editorStr)
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
      this.activeData.__methods__[this.eventName] = this.jsonEditor.getValue()
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
</style>