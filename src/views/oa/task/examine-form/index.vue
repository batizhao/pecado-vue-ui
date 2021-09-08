<template>
  <div>
    <!-- <div class="top-panel">
      <el-button type="text" class="">查看流程图</el-button>
      <el-button type="text" class="pl20">暂存</el-button>
      <el-button type="text" class="pl20">删除</el-button>
      <el-button type="text" :loading="compeleteLoading" class="pl20" @click="compelete">完成</el-button>
      <el-button type="text" class="pl20" >关闭</el-button>
    </div> -->
    <div class="app-container" v-loading="!dataLoad">
      <Parse
          v-if="dataLoad"
          :form-conf="jsonData" @submit="sumbitFormParse" :showSubmit="false"
          ref="form"
        >
      </Parse>
    </div>
    <el-row style="text-align: center;">
      <el-button type="primary" :loading="compeleteLoading" @click="compelete">审批</el-button>
    </el-row>
    <el-dialog title="流程审批" :visible.sync="open" width="500px">
      <ExamineDialog ref="examineDialog"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="dialogConfirm">确 定</el-button>
        <el-button @click="dialogCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getTask, submitTask } from "@/api/oa/task";
import { getFormByKey } from "@/api/dp/form";
import { getFromUrl }  from "@/api/common";
import ExamineDialog from '@/views/oa/task/examine-dialog/index.vue'
import Parse from '@/components/CodeEditor/components/parser/Parser.vue'

export default {
  name: "examingForm",
  components: {
    ExamineDialog,
    Parse
  },
  data () {
    return {
      jsonData: null,
      dynamicData: {
      },
      remoteFuncs: {
      },
      form: {},// 表单参数
      dataLoad:false,
      submitLoading:false,
      compeleteLoading:false,
      open:false,
      routerQuery:{},
      processDefinitionData:{}
    }
  },
  mounted(){

    this.routerQuery = this.$route.params && this.$route.query;
    console.log('routerQuery:',this.routerQuery);
    const id = this.$route.params.id;
    //表单从待办任务跳过来
    getTask(id).then(response => {
      this.processDefinitionData = response.data || {};
      const formKey = response.data.config.config.form.pcPath;
      console.log("formKey:",formKey);
      getFormByKey(formKey).then( res => {

        const formObj = JSON.parse(res.data.metadata || '{}');
        console.log("formObj:",formObj);
        this.jsonData = formObj.formData || {};

        // this.form.taskId = this.routerQuery.taskId;
        // this.form.procInstId = this.routerQuery.procInstId
        
        if (this.routerQuery.url && this.routerQuery.appId !== null) {
            let url = this.routerQuery.url + this.routerQuery.appId;
          getFromUrl(url).then( formUlrRes => {
            // this.form = JSON.parse(JSON.stringify(formUlrRes.data || {}));

            const formUlrData = formUlrRes.data || {};

            this.jsonData.fields.forEach(item => {
              const val = formUlrData[item.__vModel__]
              if (val) {
                item.__config__.defaultValue = val
              }
            })
            this.$forceUpdate();
            this.dataLoad = true;
          }).catch( err => {
            this.dataLoad = true;
            console.log(err);
          })
        }else{
            this.dataLoad = true;
        }
      });
    })
  },
  created() {
  
  },
  methods: {
    compelete(){
      this.open = true;
      const processDefinitionId = this.routerQuery.procDefId;
      const taskDefKey = this.routerQuery.taskDefKey;
      const examineData = {
          processDefinitionId,
          taskDefKey
      }
      this.$nextTick( () => {
        this.$refs.examineDialog.show(examineData);
      })
    },
    dialogConfirm(){
      this.submitLoading = true;
      this.$refs.examineDialog.getExamineData().then( flowData =>{
        console.log(flowData);
        const submitData = { processNodeDTO:flowData};
        let { dto,config } = this.processDefinitionData;
        submitData.current = dto.id;
        submitData.processDefinitionId = config.processDefId;
        submitData.procInstId = this.routerQuery.procInstId;
        submitData.taskId = this.routerQuery.taskId;
        submitData.id = this.form.id;
        submitData.title = this.form.title;
        submitTask(submitData).then(response => {
          this.msgSuccess("保存成功");
          this.submitLoading = false;
          this.open = false;
        }).catch( err => {
            console.log(err);
            this.submitLoading = false;
        });
      }).catch( err => {
        this.$message.error(err);
        this.submitLoading = false;
        console.log(err);
      })
    },
    dialogCancel(){
      this.open = false;
    },
    sumbitFormParse(data){
      console.log("sumbitFormParse:",data);
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