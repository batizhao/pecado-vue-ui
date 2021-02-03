<template>
  <!-- 导入表 -->
  <el-dialog title="导入表" :visible.sync="visible" width="850px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="请输入表描述"
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
    <el-row>
      <el-table @row-click="clickRow" ref="table" :data="dbTableList" @selection-change="handleSelectionChange" height="300px">
        <el-table-column type="selection" min-width="1" />
        <el-table-column prop="dsName" label="数据源" :show-overflow-tooltip="true" min-width="1" />
        <el-table-column prop="tableName" label="表名称" :show-overflow-tooltip="true" min-width="1" />
        <el-table-column prop="tableComment" label="表描述" :show-overflow-tooltip="true" min-width="1.5" />
        <el-table-column prop="createTime" label="创建时间" min-width="2" />
        <el-table-column prop="updateTime" label="更新时间" min-width="2" />
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.current"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleImportTable">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listCodeMetaPage, importCodeMeta } from "@/api/dp/code";
export default {
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      tables: [],
      // 总条数
      total: 0,
      // 表数据
      dbTableList: [],
      // 查询参数
      queryParams: {
        current: 1,
        pageSize: 10,
        tableName: undefined,
        tableComment: undefined
      }
    };
  },
  methods: {
    // 显示弹框
    show() {
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.tables = selection;
    },
    // 查询表数据
    getList() {
      listCodeMetaPage(this.queryParams).then(res => {
        if (res.code === 0) {
          this.dbTableList = res.data.records;
          this.total = res.data.total;
        }
      });
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
    /** 导入按钮操作 */
    handleImportTable() {
      importCodeMeta(this.tables).then(res => {
        this.msgSuccess(res.message);
        if (res.code === 0) {
          this.visible = false;
          this.$emit("ok");
        }
      });
    }
  }
};
</script>
