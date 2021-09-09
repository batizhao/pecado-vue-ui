<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="发单部门" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入发单部门"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发单人" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入发单人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['oa:invoice:add']"
        >添加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['oa:invoice:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['oa:invoice:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="invoiceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="单位名称" align="center" prop="company" />
      <el-table-column label="纳税人识别号" align="center" prop="companyNumber" />
      <el-table-column label="发票类型" align="center" prop="type" />
      <el-table-column label="发单部门" align="center" prop="deptName" />
      <el-table-column label="发单人" align="center" prop="username" />
      <el-table-column label="发单日期" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['oa:invoice:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
    <!-- 添加或编辑手工开票对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" v-if="open" append-to-body :close-on-click-modal="false">
      <el-steps :active="active" finish-status="success">
        <el-step title="步骤1"></el-step>
        <el-step title="步骤2"></el-step>
      </el-steps>
      <el-row class="step-body">
        <Parse
          v-show="active == 0"
          :form-conf="jsonData" :edit-data="editData" @submit="sumbitFormParse" :showSubmit="false"
          ref="form"
        >
        </Parse>
        <ExamineDialog v-show="active == 1" ref="examineDialog"/>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="active == 1" @click="preStep()">上一步</el-button>
        <el-button v-if="active == 0" @click="nextStep()">下一步</el-button>
        <el-button v-if="active == 1" type="primary" :loading="submitLoading" @click="submitForm()">确定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInvoices, getInvoice, deleteInvoice, addOrUpdateInvoice } from "@/api/oa/invoice";
import { getFormByKey } from "@/api/dp/form";
import { getProcessDefinition } from "@/api/oa/task";
import ExamineDialog from '@/views/oa/task/examine-dialog/index.vue'
import Parse from '@/components/CodeEditor/components/parser/Parser.vue'

export default {
  name: "Invoice",
  components: {
    ExamineDialog,
    Parse
  },
  data() {
    return {
      jsonData: {
      },
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
      // 手工开票表格数据
      invoiceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        deptName: null,
        username: null,
      },
      editData: {
        username: "管理员",
        deptName: "江苏省",
        // createTime: "2021-09-07",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        company: [
          { required: true, message: "单位名称不能为空", trigger: "blur" }
        ],
        companyNumber: [
          { required: true, message: "纳税人识别号不能为空", trigger: "blur" }
        ],
      },
      //流程数据
      processDefinitionData:{},
      //表单接口提交数据
      submitFormData:{},
      //步骤数
      active: 0,
      //拟稿提交按钮loading
      submitLoading:false,
      //拟稿按钮loading
      handleAddLoading:false
    };
  },
  created() {
    this.getList();
    this.handleAddLoading = true;
    getProcessDefinition('jsoa_sgkjfpsp').then( response => {
      this.processDefinitionData = response.data || {};
      const formKey = response.data.view.config.config.form.pcPath || '6135bd76df5244611e50a1bb';
      getFormByKey(formKey).then( res => {
        const formObj = JSON.parse(res.data.metadata || '{}');
        this.jsonData = formObj.formData || {};
        this.handleAddLoading = false;
      }).catch( err => {
        console.log(err);
        this.handleAddLoading = false;
      });
    }).catch( err => {
      console.log(err);
      this.handleAddLoading = false;
    });
  },
  methods: {
    /** 查询手工开票列表 */
    getList() {
      this.loading = true;
      listInvoices(this.queryParams).then(response => {
        this.invoiceList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 添加按钮操作 */
    handleAdd() {
      this.reset();
      this.title = "添加手工开票";
      this.active = 0;
      this.$forceUpdate();
      this.$nextTick( () => {
        this.open = true;
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.submitLoading = true;
      console.log(this.submitFormData);
      this.$refs.examineDialog.getExamineData().then( flowData =>{
        console.log(flowData);
        const submitData = { task:{processNodeDTO:flowData.processNodeDTO},invoice:{} };
        let { dto,view } = this.processDefinitionData;
        submitData.task.current = view.dto.id;
        submitData.task.processDefinitionId = dto.id;
        Object.assign(submitData.invoice, this.submitFormData);
        submitData.invoice.id = undefined;
        console.log("submitData:",submitData);
        
        addOrUpdateInvoice(submitData).then(response => {
          this.msgSuccess("保存成功");
          this.getList();
          this.open = false;
          this.submitLoading = false;
        }).catch( err => {
          this.submitLoading = false;
          console.log(err);
        });
      }).catch( err => {
        console.log(err);
        this.msgError(err);
        this.submitLoading = false;
      })
    },
    sumbitFormParse(data){
      return new Promise( (resolve,reject) => {
        console.log("sumbitFormParse:", data);
        resolve(data)
      });
    },
    /**拟稿弹框下一步 */
    nextStep(){
      this.$refs.form.submitForm().then( data => {
        console.log("nextStep:",data);
        this.active = 1;
        this.submitFormData = data;
        const examineData = {
          processDefinitionId: this.processDefinitionData.dto.id,
          taskDefKey: this.processDefinitionData.view.dto.id
        }
        this.$nextTick( () => {
          this.$refs.examineDialog.show(examineData);
        })
      }).catch( err => {
        console.log(err);
      })
    },
    /**拟稿弹框上一步 */
    preStep(){
      this.active = 0;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除手工开票编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return deleteInvoice(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(error => {
        reject(error)
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有手工开票数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportInvoice(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.step-body {
	padding: 50px;
}
</style>
