<template>
  <div class="app-container" v-loading="codeEditorLoading">
    <codeEditor
      v-if="pageData"
      :pageData="pageData"
      @save="handleSave"
    />
  </div>
</template>

<script>
import codeEditor from '@/components/CodeEditor/views/index/Home.vue'
import { getDataDetail, addOrEditData } from "@/api/app/formModel.js";
export default {
  name: "FormDesign",
  components: {
		codeEditor
	},
  props: {
    formInfo: Object
  },
  data() {
    return {
      pageData: null,
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
        getDataDetail(this.formInfo.id).then(res => {
          this.codeEditorLoading = false
          const formObj = JSON.parse(res.data.metadata || '{}');
          this.pageData = formObj.formData || {};
        }).catch(() => {
          this.pageData = null
          this.codeEditorLoading = false
        })
    },
    handleSave (args) {
      this.codeEditorLoading = true;
      addOrEditData({
        id: this.formInfo.id,
        metadata: JSON.stringify(args)
      }).then(res => {
        this.msgSuccess('保存成功');
        this.codeEditorLoading = false;
        this.$emit('success')
      }).catch( err => {
        console.log(err);
        this.codeEditorLoading = false;
      });
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/app/form", query: { t: Date.now()}})
    }
  }
}
</script>
