<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名称"
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
          icon="el-icon-download"
          size="mini"
          @click="handleGenCode"
          v-hasPermi="['dp:code:gen']"
        >生成</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload"
          size="mini"
          @click="openImportTable"
          v-hasPermi="['dp:code:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['dp:code:edit']"
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
          v-hasPermi="['dp:code:delete']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="1" align="center" />
      <el-table-column
        label="数据源"
        align="center"
        prop="dsName"
        :show-overflow-tooltip="true"
        min-width="1"
      />
      <el-table-column
        label="表名称"
        align="center"
        prop="tableName"
        :show-overflow-tooltip="true"
        min-width="1"
      />
      <el-table-column
        label="表描述"
        align="center"
        prop="tableComment"
        :show-overflow-tooltip="true"
        min-width="2"
      />
      <el-table-column
        label="实体"
        align="center"
        prop="className"
        :show-overflow-tooltip="true"
        min-width="1"
      />
      <el-table-column label="创建时间" align="center" prop="createTime" min-width="2" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="2">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['dp:code:edit']"
          >编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
               更多 <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-notebook-2" @click.native="handleFormDesign(scope.row)">设计表单</el-dropdown-item>
              <el-dropdown-item icon="el-icon-view" @click.native="handlePreview(scope.row)" v-hasPermi="['dp:code:preview']">预览</el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" @click.native="handleDelete(scope.row)" v-hasPermi="['dp:code:delete']">删除</el-dropdown-item>
              <el-dropdown-item icon="el-icon-refresh" @click.native="handleSynchMeta(scope.row)" v-hasPermi="['dp:code:sync']">同步</el-dropdown-item>
              <el-dropdown-item icon="el-icon-download" @click.native="handleGenCode(scope.row)" v-hasPermi="['dp:code:gen']" divided>生成代码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    <!-- 预览界面 -->
    <el-dialog :title="preview.title" :visible.sync="preview.open" width="80%" top="5vh" append-to-body>
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="(value, key) in preview.data"
          :label="key"
          :name="key"
          :key="key"
        >
          <pre><code class="hljs" v-html="highlightedCode(value, key)"></code></pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <import-meta ref="import" @ok="handleQuery" />
  </div>
</template>

<script>
import { listCodePage, previewCode, deleteCode, genCode, syncCodeMeta } from "@/api/dp/code";
import importMeta from "./importMeta";
import { downLoadZip } from "@/utils/download";
import hljs from "highlight.js/lib/core";
import "highlight.js/styles/github-gist.css";
hljs.registerLanguage("java", require("highlight.js/lib/languages/java"));
hljs.registerLanguage("xml", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("html", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("vue", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("javascript", require("highlight.js/lib/languages/javascript"));
hljs.registerLanguage("sql", require("highlight.js/lib/languages/sql"));

export default {
  name: "Code",
  components: { importMeta },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 唯一标识符
      uniqueId: "",
      // 选中数组
      ids: [],
      // 选中表数组
      tableNames: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表数据
      tableList: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        tableName: undefined,
        tableComment: undefined
      },
      // 预览参数
      preview: {
        open: false,
        title: "代码预览",
        data: {},
        activeName: "Domain.java"
      }
    };
  },
  created() {
    this.getList();
  },
  activated() {
    const time = this.$route.query.t;
    if (time != null && time != this.uniqueId) {
      this.uniqueId = time;
      this.resetQuery();
    }
  },
  methods: {
    /** 查询表集合 */
    getList() {
      this.loading = true;
      listCodePage(this.queryParams).then(response => {
          this.tableList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 生成代码操作 */
    handleGenCode(row) {
      const ids = row.id || this.ids;
      if (ids == "") {
        this.msgError("请选择要生成的数据");
        return;
      }
      if(row.type === "path") {
        genCode(row.id).then(response => {
          this.msgSuccess("成功生成到自定义路径：" + row.path);
        });
      } else {
        downLoadZip("/dp/code/zip?ids=" + ids);
      }
    },
    /** 同步数据库操作 */
    handleSynchMeta(row) {
      const tableName = row.tableName;
      this.$confirm('确认要强制同步"' + tableName + '"表结构吗？', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
          return syncCodeMeta(row.id);
      }).then(() => {
          this.msgSuccess("同步成功");
      })
    },
    /** 打开导入表弹窗 */
    openImportTable() {
      this.$refs.import.show();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 预览按钮 */
    handlePreview(row) {
      previewCode(row.id).then(response => {
        this.preview.data = response.data;
        this.preview.open = true;
      });
    },
    /** 高亮显示 */
    highlightedCode(code, key) {
      var language = key.substring(key.lastIndexOf(".") + 1, key.length);
      const result = hljs.highlight(language, code || "", true);
      return result.value || '&nbsp;';
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.tableNames = selection.map(item => item.tableName);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids[0];
      this.$router.push("/code/edit/" + id);
    },
    /** 设计表单操作 */
    handleFormDesign(row) {
      this.$router.push({
        name: "FormDesign", 
        params: {
          formKey: row.formKey
        } 
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const names = row.tableName || this.tableNames;
      this.$confirm('确认删除"' + names + '"吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
          return deleteCode(ids);
      }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
      })
    }
  }
};
</script>