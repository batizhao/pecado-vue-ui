<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch">
      <el-form-item label="公文标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入公文标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="taskList">
      <el-table-column label="任务ID" align="center" prop="taskId" />
      <el-table-column label="procInstId" align="center" prop="procInstId" />
      <el-table-column label="任务名" align="center" prop="taskName" />
      <el-table-column label="公文标题" align="center" prop="title" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)">审批</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
    <!-- 添加或编辑审批对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      v-if="open"
      :show-close="false"
      :close-on-click-modal="false">
      <el-steps :active="active" finish-status="success">
        <el-step title="步骤1"></el-step>
        <el-step title="步骤2"></el-step>
      </el-steps>
      <el-row class="step-body">
        <Parse
          v-show="active == 0"
          :form-conf="jsonData"
          :showSubmit="false"
          ref="form">
        </Parse>
        <ExamineDialog v-show="active == 1" ref="examineDialog" />
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="active == 1" @click="preStep()">上一步</el-button>
        <el-button v-if="active == 0" @click="nextStep()">下一步</el-button>
        <el-button
          v-if="active == 1"
          type="primary"
          :loading="submitLoading"
          @click="submitForm()">确定</el-button>
        <el-button :loading="submitLoading" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="任务签收提示"
      :visible.sync="taskSignTipsOpen"
      width="800px"
      :show-close="false"
      :close-on-click-modal="false"
    > 
      <el-form label-width="180px">
        <el-form-item label="待办人：">
          <span></span>
        </el-form-item>
        <el-form-item label="在办人：">
          <span></span>
        </el-form-item>
        <el-form-item label="发件人：">
          <span></span>
        </el-form-item>
        <el-form-item label="发件时间：">
          <span></span>
        </el-form-item>
        <el-form-item label="主题：">
          <span></span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="signTaskLoading" @click="signTaskCancel()">关闭</el-button>
        <el-button type="primary" :loading="signTaskLoading" @click="signTaskComfirm()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTodoTasks, getTask, submitTask, getFlowNodeComments,signTask } from "@/api/oa/task";
import { getFormByKey } from "@/api/app/formModel";
import { getFromUrl } from "@/api/common";
import ExamineDialog from "@/views/oa/task/examine-dialog/index.vue";
import Parse from "@/components/CodeEditor/components/parser/Parser.vue";

export default {
  name: "Task",
  components: {
    Parse,
    ExamineDialog
  },
  data() {
    return {
      jsonData: {},
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 显示搜索条件
      showSearch: true,
      // 审批表格数据
      taskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        status: 1,
        type: "1",
        current: 1,
        size: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //步骤数
      active: 0,
      currentForm: {},
      //审核提交 loading
      submitLoading: false,
      //当前列表选中的数据
      currentRow: null,
      //任务签收提示弹框是否显示
      taskSignTipsOpen:false,
      //签收loading
      signTaskLoading:false,
      //签收信息
      signTaskForm:{},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询审批列表 */
    getList() {
      this.loading = true;
      listTodoTasks(this.queryParams)
        .then(response => {
          this.taskList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {};
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 编辑按钮操作 */
    async handleUpdate(row) {
      this.active = 0;
      this.currentRow = row;
      this.loading = true;
      try {
        this.taskResponse = await getTask(row.taskId);
        console.log("taskResponse:",this.taskResponse);
        const autosign = this.taskResponse.data.config.config.global.controlCode.autosign;//判断是否自动签收
        if (autosign == "true") {
          await signTask({ taskId:this.currentRow.taskId, type:0 });
          this.examineForm();
        }else{
          this.taskSignTipsOpen = true;
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    // 表单审批
    async examineForm(){
      try {
        this.processDefinitionData = this.taskResponse.data || {};
        const formKey = this.taskResponse.data.config.config.form.pcPath;
        console.log("formKey:", formKey);

        const formByKeyResponse = await getFormByKey(formKey);
        this.currentForm = formByKeyResponse.data || {};
        if (!formByKeyResponse.data) {
          this.loading = false;
          this.signTaskLoading = false;
          this.$message.error("表单数据不存在！")
          return;
        }
        const formObj = JSON.parse(formByKeyResponse.data.metadata || "{}");
        console.log("formObj:", formObj);
        this.jsonData = formObj.formData || {};
        if (!(this.currentRow.url && this.currentRow.appId !== null)) {
          this.loading = false;
          this.signTaskLoading = false;
          return;
        }
        let url = this.currentRow.url + this.currentRow.appId;

        const formUrlResponse = await getFromUrl(url);
        const formUlrData = formUrlResponse.data || {};
        this.jsonData.fields.forEach(item => {
          const val = formUlrData[item.__vModel__];
          if (val) {
            item.__config__.defaultValue = val;
          }
        });
        //本部门主任审签
        const deptCommentOBj = (this.jsonData.fields || []).find( item => { return item.__vModel__ == 'deptComment'});
        if (!deptCommentOBj) {
          this.open = true;
          this.loading = false;
          this.signTaskLoading = false;
          this.taskSignTipsOpen = false;
          return
        }
        const postData = {};
        postData.orderRule = 0;
        postData.procInstId = this.currentRow.procInstId;
        postData.taskDefKeyList = this.taskResponse.data.config.config.form.controlCode.taskList;
        if (!postData.taskDefKeyList) {
          this.open = true;
          this.loading = false;
          this.signTaskLoading = false;
          this.taskSignTipsOpen = false;
          return
        }

        const flowNodeCommentsResponse = await getFlowNodeComments(postData);
        console.log("flowNodeCommentsResponse:",flowNodeCommentsResponse);
        if (flowNodeCommentsResponse.data && flowNodeCommentsResponse.data[0]) {
          deptCommentOBj.__config__.defaultValue = flowNodeCommentsResponse.data[0].message;
        } else {
          deptCommentOBj.__config__.defaultValue = "无意见";
        }
        this.signTaskLoading = false;
        this.taskSignTipsOpen = false;
        this.loading = false;
        this.open = true;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    /**审批弹框上一步 */
    preStep() {
      this.active = 0;
    },
    /**审批弹框下一步 */
    nextStep() {
      this.active = 1;
      const processDefinitionId = this.currentRow.procDefId;
      const taskDefKey = this.currentRow.taskDefKey;
      const examineData = {
        processDefinitionId,
        taskDefKey
      };
      this.$nextTick(() => {
        this.$refs.examineDialog.show(examineData);
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.submitLoading = true;
      this.$refs.examineDialog
        .getExamineData()
        .then(examineResponse => {
          console.log(
            examineResponse.processNodeDTO,
            examineResponse.suggestion
          );
          const submitData = { processNodeDTO: examineResponse.processNodeDTO };
          let { dto, config } = this.processDefinitionData;
          submitData.current = dto.id;
          submitData.processDefinitionId = config.processDefId;
          submitData.procInstId = this.currentRow.procInstId;
          submitData.taskId = this.currentRow.taskId;
          submitData.id = this.currentForm.id;
          submitData.title = this.currentRow.title;
          submitData.suggestion = examineResponse.suggestion;
          submitTask(submitData)
            .then(response => {
              this.msgSuccess("保存成功");
              this.submitLoading = false;
              this.open = false;
              this.getList();
            })
            .catch(err => {
              console.log(err);
              this.submitLoading = false;
            });
        })
        .catch(err => {
          this.$message.error(err);
          this.submitLoading = false;
          console.log(err);
        });
    },
    //取消签收
    signTaskCancel(){
      this.taskSignTipsOpen = false;
      this.getList();
    },
    //签收
    async signTaskComfirm(){
      try {
        this.signTaskLoading = true;
        const signTaskResponse = await signTask({ taskId:this.currentRow.taskId, type:0 });
        console.log("signTaskResponse:",signTaskResponse);
        this.examineForm();
      } catch (error) {
        this.signTaskLoading = false;
        console.log(error);
      }
    },
  }
};
</script>
