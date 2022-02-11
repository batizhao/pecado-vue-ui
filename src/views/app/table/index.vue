<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
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
          v-hasPermi="['app:dev:add']"
        >添加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['app:dev:edit']"
        >编辑</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['app:dev:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['app:dev:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="appTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="数据源" align="center" prop="dsName" />
      <el-table-column label="表名" align="center" prop="tableName" />
      <el-table-column label="表注释" align="center" prop="tableComment" />
      <el-table-column label="列名" align="center" prop="columnName" />
      <el-table-column label="列注释" align="center" prop="columnComment" />
      <el-table-column label="列类型" align="center" prop="columnType" />
      <el-table-column label="长度" align="center" prop="length" />
      <el-table-column label="小数点位数" align="center" prop="decimal" />
      <el-table-column label="是否主键" align="center" prop="primaryKey" />
      <el-table-column label="是否自增" align="center" prop="increment" />
      <el-table-column label="是否必须" align="center" prop="required" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['app:dev:edit']"
          >编辑</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['app:dev:delete']"
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
    <!-- 添加或编辑应用表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-if="open" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="表名" prop="tableName">
          <el-input v-model="form.tableName" placeholder="请输入表名" />
        </el-form-item>
        <el-form-item label="表注释" prop="tableComment">
          <el-input v-model="form.tableComment" placeholder="请输入表注释" />
        </el-form-item>
        <el-form-item label="列名" prop="columnName">
          <el-input v-model="form.columnName" placeholder="请输入列名" />
        </el-form-item>
        <el-form-item label="列注释" prop="columnComment">
          <el-input v-model="form.columnComment" placeholder="请输入列注释" />
        </el-form-item>
        <el-form-item label="长度" prop="length">
          <el-input v-model="form.length" placeholder="请输入长度" />
        </el-form-item>
        <el-form-item label="小数点位数" prop="decimal">
          <el-input v-model="form.decimal" placeholder="请输入小数点位数" />
        </el-form-item>
        <el-form-item label="是否主键" prop="primaryKey">
          <el-input v-model="form.primaryKey" placeholder="请输入是否主键" />
        </el-form-item>
        <el-form-item label="是否自增" prop="increment">
          <el-input v-model="form.increment" placeholder="请输入是否自增" />
        </el-form-item>
        <el-form-item label="是否必须" prop="required">
          <el-input v-model="form.required" placeholder="请输入是否必须" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAppTables, listAppTable, getAppTable, deleteAppTable, addOrUpdateAppTable, changeAppTableStatus } from "@/api/app/table";
import { downLoadExcel } from "@/utils/download";

export default {
  name: "AppTable",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中数组
      names: [],
      // 当前id
      id: null,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 显示搜索条件
      showSearch: true,
      // 应用表表格数据
      appTableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dsName: [
          { required: true, message: "数据源不能为空", trigger: "change" }
        ],
        tableName: [
          { required: true, message: "表名不能为空", trigger: "blur" }
        ],
        tableComment: [
          { required: true, message: "表注释不能为空", trigger: "blur" }
        ],
        columnName: [
          { required: true, message: "列名不能为空", trigger: "blur" }
        ],
        columnComment: [
          { required: true, message: "列注释不能为空", trigger: "blur" }
        ],
        columnType: [
          { required: true, message: "列类型不能为空", trigger: "change" }
        ],
        length: [
          { required: true, message: "长度不能为空", trigger: "blur" }
        ],
        primaryKey: [
          { required: true, message: "是否主键不能为空", trigger: "blur" }
        ],
        increment: [
          { required: true, message: "是否自增不能为空", trigger: "blur" }
        ],
        required: [
          { required: true, message: "是否必须不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询应用表列表 */
    getList() {
      this.loading = true;
      listAppTables(this.queryParams).then(response => {
        this.appTableList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 应用表状态编辑
    handleStatusChange(row) {
      let text = row.status === "open" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeAppTableStatus(row.id, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "open" ? "close" : "open";
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
      this.resetForm("form");
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
      this.names = selection.map(item => item.name);
      this.single = selection.length!==1
      this.multiple = !selection.length
    },    
    /** 添加按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加应用表";
    },    
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.id = row.id || this.ids
      getAppTable(this.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑应用表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          addOrUpdateAppTable(this.form).then(response => {
            this.msgSuccess("保存成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const names = row.name || this.names;
      this.$confirm('确认删除"' + names + '"吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return deleteAppTable(ids);
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
      this.$confirm('是否确认导出所有应用表数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        downLoadExcel("/app/table/export", queryParams);
      })
    }
  }
};
</script>
