<template>
  <div class="app-container">
    <codeEditor
    v-loading="codeEditorLoading"
    :key="id"
    :pageData="pageData"
    @save="handleSave"
     />
  </div>
</template>

<script>
import codeEditor from '@/components/CodeEditor/views/index/Home.vue'
import { getFormByKey,addFormMetaData } from "@/api/dp/form";
export default {
  name: "FormDesign",
  components: {
		codeEditor
	},
  data() {
    return {
      id: 0,
      formKey: "",
      metadata: "{}",
      pageData:{},
      codeEditorLoading:false
    }
  },
  created() {
    this.handleFormReady();
  },
  methods: {
    handleFormReady () {
      this.codeEditorLoading = true;
      const formKey = this.$route.params && this.$route.params.formKey;
      if (formKey) {
        this.formKey = formKey
        // 获取表单详细信息
        getFormByKey(formKey).then(res => {
          this.id = res.data.id;
          const formObj = JSON.parse(res.data.metadata || '{}');
          console.log("formObj:",formObj);
          this.pageData = formObj.formData || {};
          console.log(this.pageData);
          this.codeEditorLoading = false;
          this.$forceUpdate();
        }).catch( err => {
          console.log(err);
          this.codeEditorLoading = false;
        });
      }else{
        this.codeEditorLoading = false;
      }
    },
    handleSave (args) {
      console.log(args)
      console.log(args)
      this.codeEditorLoading = true;
      addFormMetaData(this.id, JSON.stringify(args)).then(res => {
        this.msgSuccess(res.message);
        this.codeEditorLoading = false;
        if (res.code === 0) {
          this.close();
        }
      }).catch( err => {
        console.log(err);
        this.codeEditorLoading = false;
      });
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/dp/form", query: { t: Date.now()}})
    }
  }
}
</script>
