<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="类名" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="请输入类名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作说明" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入操作说明"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日志类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择日志类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:log:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
          v-hasPermi="['system:log:clean']"
        >清空</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:log:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="HTTP方法" align="center" prop="httpRequestMethod" />
      <el-table-column label="操作说明" align="center" prop="description" :show-overflow-tooltip="true" />
      <el-table-column label="操作时长" align="center" prop="spend" />
      <el-table-column label="日志类型" align="center" prop="type">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.type === 'success' ? 'success' : 'danger'">{{typeFormat(scope.row)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作用户" align="center" prop="username" />
      <el-table-column label="操作IP" align="center" prop="ip" />
      <el-table-column label="操作时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >详情</el-button>
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

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="24">
            <el-form-item label="id：">{{ form.id }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类名：">{{ form.className }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类方法：">{{ form.classMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="HTTP方法：">{{ form.httpRequestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作说明">{{ form.description }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参数：">{{ form.parameter }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结果：">{{ form.result }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="客户端：">{{ form.clientId }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作用户名：">{{ form.username }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="URL：">{{ form.url }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="IP：">{{ form.ip }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作时间：">{{ parseTime(form.createTime) }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listLog, deleteLog, cleanLog } from "@/api/system/log";
import { downLoadExcel } from "@/utils/download";

export default {
  name: "Log",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 日志表格数据
      logList: [],
      // 日志类型字典
      typeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        className: null,
        username: null,
      },
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getList();
    this.listDictDataByCode("success_or_fail").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    /** 查询日志列表 */
    getList() {
      this.loading = true;
      listLog(this.queryParams).then(response => {
        this.logList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 日志类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
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
      this.multiple = !selection.length
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除日志编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return deleteLog(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有操作日志数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return cleanLog();
      }).then(() => {
        this.getList();
        this.msgSuccess("清空成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        downLoadExcel("/system/log/export", queryParams);
      })
    },
  }
};
</script>