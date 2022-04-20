<template>
  <el-dialog
    title="全局样式设置"
    :visible.sync="globalStylesVisible"
    width="80%"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <div id="globalStyleEditorJs" style="height: 400px;" />
    <span slot="footer">
      <el-button @click="cancel" size="small">取消</el-button>
      <el-button type="primary" @click="submit" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addCSS } from '@/components/CodeEditor/components/parser/addStyleToDocument.js'
import loadMonaco from '@/components/CodeEditor/utils/loadMonaco'
let monaco
export default {
  data () {
    return {
      globalStylesVisible: false,
      monaco: null
    }
  },
  watch: {
    globalStylesVisible (val) {
      if (val) this.initStyles = this.$store.state.codeEditor.components.formConf.styles
    }
  },
  computed: {
    globalStyles: {
      get () {
        return this.$store.state.codeEditor.components.formConf.styles || '/* 页面根节点 .page-root */\n.page-root {\n  \n}\n'
      },
      set (val) {
        const formConf = this.$store.state.codeEditor.components.formConf
        this.$set(formConf, 'styles', val)
      }
    }
  },
  methods: {
    submit () {
      this.globalStylesVisible = false
      this.globalStyles = this.jsonEditor.getValue()
      addCSS('component-global-style-panel', this.$store.state.codeEditor.components.formConf.styles)
      this.$emit('submit')
    },
    cancel () {
      this.globalStyles = this.initStyles
      this.globalStylesVisible = false
    },
    open () {
      this.globalStylesVisible = true
      this.$nextTick(() => {
        this.onOpen()
      })
    },
    onOpen() {
      loadMonaco(val => {
        monaco = val
        this.setEditorValue('globalStyleEditorJs', this.globalStyles)
      })
    },
    setEditorValue(id, codeStr) {
      if (this.jsonEditor) {
        this.jsonEditor.setValue(codeStr)
      } else {
        this.jsonEditor = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: 'css',
          automaticLayout: true
        })
      }
    },
  },
  mounted () {
    addCSS('component-global-style-panel', this.$store.state.codeEditor.components.formConf.styles)
  }
}
</script>
