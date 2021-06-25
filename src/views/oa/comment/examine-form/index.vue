<template>
  <div class="app-container" v-loading="!dataLoad">
    <fm-generate-form
        class="form"
        v-if="dataLoad"
        :data="jsonData"
        :remote-option="dynamicData"
        :remote="remoteFuncs"
        :value="form"
        ref="form"
      >
    </fm-generate-form>
    <el-row class="form-bottom">
      <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
    </el-row>
  </div>
</template>
<script>
import { addOrUpdateComment } from "@/api/oa/comment";
import { getForm } from "@/api/dp/form";
export default {
  name: "examingForm",
  data () {
    return {
      jsonData: {
      },
      dynamicData: {
      },
      remoteFuncs: {
      },
      // 表单参数
      form: {},
      dataLoad:false,
      submitLoading:false,
    };
  },
  created() {
    this.dataLoad = false;
    const id = this.$route.params && this.$route.params.id;
    if (id) {
      getForm(1).then( response => {
        this.jsonData = JSON.parse(response.data.metadata);
        this.dataLoad = true;
      });
    }
  },
  methods: {
    submitForm(){
      this.submitLoading = true;
      this.$refs.form.getData().then(data => {
        addOrUpdateComment(data).then(response => {
          this.msgSuccess("保存成功");
          this.submitLoading = false;
        }).catch( err => {
          console.log(err);
          this.submitLoading = false;
        });
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.form {
	padding-left: 50px;
	padding-right: 50px;
}
.form-bottom {
	text-align: center;
}
</style>