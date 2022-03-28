<template>
  <el-dialog
    title="全局样式设置"
    :visible.sync="globalStylesVisible"
    width="30%"
    :modal="false"
    :center="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-input type="textarea" rows="8" v-model="globalStyles"></el-input>
    <span slot="footer">
      <el-button @click="cancel" size="small">取消</el-button>
      <el-button type="primary" @click="submit" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addCSS } from '@/components/CodeEditor/components/parser/addStyleToDocument.js'
export default {
  data () {
    return {
      globalStylesVisible: false
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
        return this.$store.state.codeEditor.components.formConf.styles || '.center-board-row {\n  /* 请在此处写全局样式 */\n\n}'
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
      addCSS('component-global-style-panel', this.$store.state.codeEditor.components.formConf.styles)
    },
    cancel () {
      this.globalStyles = this.initStyles
      this.globalStylesVisible = false
    }
  },
  mounted () {
    addCSS('component-global-style-panel', this.$store.state.codeEditor.components.formConf.styles)
  }
}
</script>

<style>

</style>
