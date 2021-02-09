<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dict:add']"
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
          v-hasPermi="['system:dict:edit']"
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
          v-hasPermi="['system:dict:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:dict:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dictDataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="代码" align="center" prop="code" />
      <el-table-column label="标签" align="center" prop="label" />
      <el-table-column label="值" align="center" prop="value" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="默认" align="center" prop="default" :formatter="defaultFormat" />
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="handleStatusChange(scope.row)"
            active-value="open"
            inactive-value="close"
          ></el-switch>
        </template>
      </el-table-column>
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
            v-hasPermi="['system:dict:edit']"
          >编辑</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 添加或编辑字典对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签" prop="label">
          <el-input v-model="form.label" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="form.value" placeholder="请输入值" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="默认">
          <el-radio-group v-model="form.isDefault">
            <el-radio
              v-for="dict in defaultOptions"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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
import { getDictData, deleteDictData, addOrUpdateDictData, changeDictDataStatus, exportDictData } from "@/api/system/dict/data";

export default {
  name: "DictData",
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
      //代码
      code: "",
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 字典表格数据
      dictDataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否默认字典
      defaultOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        label: [
          { required: true, message: "标签不能为空", trigger: "blur" }
        ],
        value: [
          { required: true, message: "值不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.code = this.$route.params && this.$route.params.code;
    this.getList();
    this.listDictDataByCode("yes_or_no").then(response => {
      this.defaultOptions = response.data;
    });
  },
  methods: {
    /** 查询字典列表 */
    getList() {
      this.loading = true;
      this.listDictDataByCode(this.code).then(response => {
          this.dictDataList = response.data
          this.loading = false;
        }
      );
    },
    // 字典状态编辑
    handleStatusChange(row) {
      let text = row.status === "open" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.label + '"吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeDictDataStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "open" ? "close" : "open";
        });
    },
    // 是否默认字典翻译
    defaultFormat(row, column) {
      return this.selectDictLabel(this.defaultOptions, row.isDefault);
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
      this.listDictDataByCode();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.names = selection.map(item => item.label);
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 添加按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典";
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDictData(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑字典";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.code = this.code;
          addOrUpdateDictData(this.form).then(response => {
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
      const names = row.label || this.names;
      this.$confirm('确认删除"' + names + '"吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteDictData(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有字典数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDictData(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>