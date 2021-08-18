<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="formHistoryList">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="表单key" align="center" prop="formKey" />
      <el-table-column label="表单元数据" align="center" prop="metadata" :show-overflow-tooltip="true"/>
      <el-table-column label="版本" align="center" prop="version" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
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
          >查看</el-button>
          <el-button
            type="text"
            icon="el-icon-check"
            @click="handleRevert(scope.row)"
            v-hasPermi="['dp:form:admin']"
          >恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <form-drawer
			:visible.sync="drawerVisible"
			:form-data="formData"
			size="100%"
			:generate-conf="generateConf"
		/>
  </div>
</template>

<script>
import { listFormHistory, revertForm } from "@/api/dp/form";
import FormDrawer from '@/components/CodeEditor/views/index/FormDrawer'
export default {
  name: "FormHistory",
  components: {
    FormDrawer
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      formData:{},
      drawerVisible:false,
      generateConf: {fileName: undefined, type: "file"},
      // 单历史记录表格数据
      formHistoryList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询单历史记录列表 */
    getList() {
      this.loading = true;
      const formKey = this.$route.params && this.$route.params.formKey;
      listFormHistory(formKey).then(response => {
        this.formHistoryList = response.data;
        this.loading = false;
      });
    },
    /** 查看按钮操作 */
    handleView(row) {
      const metadata = JSON.parse(row.metadata)
      this.formData = metadata.formData
      this.drawerVisible = true
    },
    /** 恢复按钮操作 */
    handleRevert(row) {
      const id = row.id;
      this.$confirm('是否确认恢复表单编号为"' + id + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return revertForm(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("恢复成功");
      })
    }
  }
};
</script>
