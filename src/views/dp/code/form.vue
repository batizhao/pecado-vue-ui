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
        <el-button type="text" icon="el-icon-upload" @click="handleSave"
          >保存</el-button
        >
      </template>
    </fm-making-form>
  </div>
</template>

<script>
import { addOrUpdateCode, getCode } from "@/api/dp/code";
// import FormMaking from "@/lib/vue-form-making";
// import "@/lib/vue-form-making/dist/FormMaking.css";

export default {
  // name: "CodeFormDesign",
  // components: {
  //   FormMaking
  // },
  data() {
    return {
      id: 0,
      metadata: "{}"
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    if (id) {
      this.id = id;
      // 获取表单详细信息
      getCode(id).then(res => {
        this.metadata = res.data.code.options;
      });
    }
  },
  methods: {
    handleFormReady() {
      this.$refs.makingform.setJSON(JSON.parse(this.metadata));
    },
    handleSave() {
      const json = this.$refs.makingform.getJSON();
      const data = { id: this.id, options: JSON.stringify(json) };
      addOrUpdateCode(data).then(res => {
        this.msgSuccess(res.message);
        if (res.code === 0) {
          this.close();
        }
      });
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/dp/code", query: { t: Date.now() } });
    }
  }
};
</script>
