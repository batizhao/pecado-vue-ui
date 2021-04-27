<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="名称" prop="name">
        <el-input
        v-model="queryParams.name"
        placeholder="请输入名称"
        clearable
        size="small"
        @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="全名" prop="fullName">
        <el-input
        v-model="queryParams.fullName"
        placeholder="请输入全名"
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
          v-hasPermi="['ims:department:add']"
        >添加</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
      v-loading="loading"
      :data="departmentList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="全名" align="center" prop="fullName" />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center">
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
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['ims:department:add']"
          >添加</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
               更多 <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-edit" @click.native="handleUpdate(scope.row)" v-hasPermi="['ims:department:edit']">编辑</el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" @click.native="handleDelete(scope.row)" v-hasPermi="['ims:department:delete']">删除</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-check" @click.native="handleDepartmentLeader(scope.row)" v-hasPermi="['ims:department:admin']">分配领导</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或编辑部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-if='open' append-to-body>   
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级部门" prop="pid" v-if="form.pid !== 0">
          <treeselect
            v-model="form.pid"
            :options="departmentOptions"
            :normalizer="normalizer"
            placeholder="选择上级部门"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="全名" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入全名" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配领导对话框 -->
    <el-dialog :title="title" :visible.sync="openLeader" width="500px" v-if='openLeader' append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="领导" prop="leaderIds">
          <el-select v-model="form.leaderIds" 
            multiple
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="filterUser"
            @change="change()">
            <el-option
              v-for="item in leaderList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLeaderForm">确 定</el-button>
        <el-button @click="cancelLeaderForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAllDepartment, getDepartment, deleteDepartment, addOrUpdateDepartment, changeDepartmentStatus, changeDepartmentLeaders, exportDepartment } from "@/api/ims/department";
import { listUser, listLeaderByDepartmentId } from "@/api/ims/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Department",
  components: {
    Treeselect,
  },
  data() {
    const leaderNotBlank = (rule, value, callback) => {
      if (this.form.leaderIds.length === 0) {
        callback(new Error("领导不能为空"));
      } else {
        callback();
      }
    };
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 部门表格数据
      departmentList: [],
      // 部门树选项
      departmentOptions: [],
      // 领导数据
      leaderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示领导弹出层
      openLeader: false,
      // 查询参数
      queryParams: {
        name: null,
        fullName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pid: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        fullName: [
          { required: true, message: "全名不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "编码不能为空", trigger: "blur" }
        ],
        leaderIds: [
          { required: true, validator: leaderNotBlank, trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listAllDepartment(this.queryParams).then(response => {
        this.departmentList = response.data;
        this.loading = false;
      });
    },
    // 强制更新
    change() { 
      this.$forceUpdate(); 
    },
    // 部门状态编辑
    handleStatusChange(row) {
      let text = row.status === "open" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeDepartmentStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "open" ? "close" : "open";
        });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      listAllDepartment().then(response => {
        this.departmentOptions = this.handleTree(response.data, "id")
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮
    cancelLeaderForm() {
      this.openLeader = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 添加按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.pid = row.id;
      }
      this.open = true;
      this.title = "添加部门";
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getDepartment(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑部门";
      });
    },
    filterUser(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          listUser({name: query}).then(response => {
            this.leaderList = response.data;
            this.loading = false;
          });
        }, 200);
      }
    },
    /** 分配领导操作 */
    handleDepartmentLeader(row) {
      this.reset();
      const id = row.id;
      listUser().then(response => {
        this.leaderList = response.data;
      });
      listLeaderByDepartmentId(row.id).then(response => {
        this.form.id = id;
        this.form.leaderIds = response.data.map(item => item.id);
        this.openLeader = true;
        this.title = "分配领导";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addOrUpdateDepartment(this.form).then(response => {
            this.msgSuccess("保存成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 提交按钮 */
    submitLeaderForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const leaders = this.form.leaderIds;
          const optionArray = [];
          Object.keys(leaders).forEach((key) =>
            optionArray.push({
              departmentId: this.form.id,
              leaderUserId: leaders[key],
            }),
          );

          changeDepartmentLeaders(optionArray).then(response => {
            this.msgSuccess("保存成功");
            this.openLeader = false;
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('确认删除"' + row.name + '"吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteDepartment(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有部门数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDepartment(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>