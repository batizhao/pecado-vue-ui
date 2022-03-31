<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
      <el-form-item label="内容">
        <el-input v-model="activeData.content">
          <el-button slot="append" icon="el-icon-edit" @click="onOpen"></el-button>
        </el-input>
      </el-form-item>
      </form-basic-setting>

      <action-dialog v-model="editorVisible" title="" @confirm="editorConfirm">
        <div id="editorJs" style="height: 400px;" />
      </action-dialog>
    </el-form>
  </div>
</template>

<script>
import mixins from './mixins'
import formBasicSetting from './formBasicSetting.vue'
import loadMonaco from '../../../utils/loadMonaco'
let monaco
export default {
  mixins: [mixins],
  components: {
    formBasicSetting
  },
  data () {
    return {
      editorVisible: false,
      editorStr: ''
    }
  },
  methods: {
    onOpen() {
      this.editorVisible = true
      this.$nextTick(() => {
        loadMonaco(val => {
          monaco = val
          this.setEditorValue('editorJs', this.activeData.content)
        })
      })
    },
    setEditorValue(id, codeStr) {
      if (this.jsonEditor) {
        this.jsonEditor.setValue(codeStr)
      } else {
        this.jsonEditor = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: 'html',
          automaticLayout: true
        })
      }
    },
    editorConfirm() {
      this.activeData.content = this.jsonEditor.getValue()
      this.editorVisible = false
    }
  }
}
</script>
