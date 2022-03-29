<template>
  <div class="app-container" v-loading="codeEditorLoading">
    <codeEditor ref="codeEditorRef" @save="handleSave"/>
  </div>
</template>

<script>
import codeEditor from '@/components/CodeEditor/views/index/Home.vue'
import { getDataDetail, addOrEditData } from "@/api/app/formModel.js";
import mixins from './setFormDataToStore.js'
export default {
  name: "FormDesign",
  mixins: [mixins],
  components: {
		codeEditor
	},
  props: {
    formInfo: Object
  },
  data() {
    return {
      codeEditorLoading:false
    }
  },
  created() {
    this.handleFormReady();
  },
  methods: {
    handleFormReady () {
      this.codeEditorLoading = true;
        // 获取表单详细信息
        getDataDetail(this.formInfo.formKey).then(res => {
          this.codeEditorLoading = false
          const formObj = JSON.parse(res.data.metadata || '{}');
          const assemby = formObj.formData
          this.setFormDataToStore(assemby)
          assemby && this.$refs.codeEditorRef.activeFormItem(assemby.fields[0])
        }).catch(() => {
          this.pageData = null
          this.codeEditorLoading = false
        })
    },
    handleSave (args) {
      this.codeEditorLoading = true;
      addOrEditData({
        id: this.formInfo.id,
        formKey: this.formInfo.formKey,
        metadata: JSON.stringify({formData: args})
      }).then(res => {
        this.msgSuccess('保存成功');
        this.codeEditorLoading = false;
        this.$emit('success')
      }).catch( err => {
        console.log(err);
        this.codeEditorLoading = false;
      });
    }
  }
}
</script>
