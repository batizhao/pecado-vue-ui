<template>
  <div class="app-container">
    <codeEditor
    :list="list"
    @save="handleSave"
     />
  </div>
</template>

<script>
import codeEditor from '@/components/CodeEditor/views/index/Home.vue'

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
      list:[]
    }
  },
  methods: {
    handleFormReady () {
      const formKey = this.$route.params && this.$route.params.formKey;
      if (formKey) {
        this.formKey = formKey
        // 获取表单详细信息
        getFormByKey(formKey).then(res => {
          this.metadata = res.data.metadata;
          this.id = res.data.id;
          if (this.metadata) {
            this.$refs.makingform.setJSON(JSON.parse(this.metadata))
          }
        }).catch( err => {
          console.log(err);
        });
      }
    },
    handleSave (args) {
      console.log(args)
      // const json = this.$refs.makingform.getJSON()
      // addFormMetaData(this.id, JSON.stringify(json)).then(res => {
      //   this.msgSuccess(res.message);
      //   if (res.code === 0) {
      //     this.close();
      //   }
      // });
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/dp/form", query: { t: Date.now()}})
    }
  }
}
</script>
