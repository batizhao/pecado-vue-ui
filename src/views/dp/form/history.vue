<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="formHistoryList">
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
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['dp:formHistory:edit']"
          >查看</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['dp:formHistory:delete']"
          >恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
import { listFormHistory } from "@/api/dp/form";

export default {
  name: "FormHistory",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
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
  }
};
</script>