<template>
  <div>
    <div class="top-panel">
      <el-button type="text" class="">查看流程图</el-button>
      <el-button type="text" class="pl20">暂存</el-button>
      <el-button type="text" class="pl20">删除</el-button>
      <el-button type="text" class="pl20" @click="compelete">完成</el-button>
      <el-button type="text" class="pl20" >关闭</el-button>
    </div>
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

      <el-dialog title="流程审批" :visible.sync="open" width="500px">
        <div class="panel-title">下一处理节点</div>
        <el-radio-group v-model="radio1">
          <el-radio :label="3">备选项1</el-radio>
          <el-radio :label="6">备选项2</el-radio>
          <el-radio :label="9">备选项3</el-radio>
        </el-radio-group>
        <el-divider></el-divider>
        <div class="panel-title">下一处理人</div>
        <el-radio-group v-model="radio2">
          <el-radio :label="3">备选项1</el-radio>
          <el-radio :label="6">备选项3</el-radio>
          <el-radio :label="9">备选项3</el-radio>
        </el-radio-group>
        <el-divider></el-divider>
        <div class="panel-title">送相关部门对接人会签环节接收人:<span>{{recieveName}}</span></div> 
        <el-divider></el-divider>
        <div class="panel-title">发送短信通知</div>
        <el-radio-group v-model="radio3">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogConfirm">确 定</el-button>
          <el-button @click="dialogCancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { addOrUpdateComment } from "@/api/oa/comment";
import { listTasks, getTask, submitTask } from "@/api/oa/task";
import { getFormByKey,getForm } from "@/api/dp/form";
import { getFromUrl }  from "@/api/common";


export default {
  name: "examingForm",
  data () {
    return {
      type:'', //comment task
      jsonData: {
      },
      dynamicData: {
      },
      remoteFuncs: {
      },
      form: {},// 表单参数
      dataLoad:false,
      submitLoading:false,
      open:false,
      radio1:null,//下一处理节点
      radio2:null,//下一处理人
      radio3:null,//发送短信通知
      recieveName:"",//送相关部门对接人会签环节接收人
    };
  },
  created() {
    this.dataLoad = false;
    this.type = this.$route.params && this.$route.query.type || 'comment';
    const routerQuery = this.$route.params && this.$route.query;
    console.log("type:",this.type);
    console.log('routerQuery:',routerQuery);
    const id = this.$route.params && this.$route.params.id;
    if (this.type == 'comment') {// type == comment 表单从发文管理跳过来
      if (id) {
        getForm(1).then( response => {
          this.jsonData = JSON.parse(response.data.metadata);
          this.dataLoad = true;
        });
      }
    }else if(this.type == 'task'){// type == task 表单从待办任务跳过来

      getTask(id).then(response => {

        const formKey = response.data.config.config.form.pcPath;
        getFormByKey(formKey).then( res => {

          this.jsonData = JSON.parse(res.data.metadata);
          let url = routerQuery.url;
          getFromUrl(url).then( formUlrRes => {

            this.form = JSON.parse(JSON.stringify(formUlrRes.data || {}));
            this.form.taskId = routerQuery.taskId;
            this.form.procInstId = routerQuery.procInstId

            this.dataLoad = true;
          })
        });
      });
    }
  },
  methods: {
    submitForm(){//表单数据提交
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
    },
    compelete(){
      this.open = true;
    },
    dialogConfirm(){
      this.open = false;
    },
    dialogCancel(){
      this.open = false;
    }
  },
}
</script>
<style lang="scss" scoped>
.top-panel {
	width: 100%;
	height: 50px;
	background-color: #d6eafc;
	text-align: center;
}
.form {
	margin-top: 20px;
	padding-left: 50px;
	padding-right: 50px;
}
.form-bottom {
	text-align: center;
}
.pl20 {
	padding-left: 20px;
}
.panel-title {
	padding-left: 10px;
	padding-bottom: 10px;
	font-weight: bold;
	font-size: 15px;
}
</style>