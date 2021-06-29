<template>
  <div class="app-container">
    <fm-making-form
      ref="makingform"
      style="height: 820px;"
      preview
      generate-code
      generate-json
      @ready="handleFormReady"
    >
      <template slot="action">
        <el-button type="text" icon="el-icon-upload" @click="handleSave">保存</el-button>
      </template>
    </fm-making-form>    
  </div>
</template>

<script>
import { addFormMetaData, getFormByKey } from "@/api/dp/form";

export default {
  name: "FormDesign",
  data() {
    return {
      id: 0,
      formKey: "",
      metadata: "{}"
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
    handleSave () {
      const json = this.$refs.makingform.getJSON()
      addFormMetaData(this.id, JSON.stringify(json)).then(res => {
        this.msgSuccess(res.message);
        if (res.code === 0) {
          this.close();
        }
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