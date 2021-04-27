<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户姓名"
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
          v-hasPermi="['ims:user:add']"
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
          v-hasPermi="['ims:user:edit']"
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
          v-hasPermi="['ims:user:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ims:user:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户名" align="center" prop="username" />
      <el-table-column label="用户邮箱" align="center" prop="email" />
      <el-table-column label="用户姓名" align="center" prop="name" />
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
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ims:user:edit']"
          >编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
               更多 <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-circle-check" @click.native="handleRole(scope.row)" v-hasPermi="['ims:user:admin']">分配角色</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-check" @click.native="handlePost(scope.row)" v-hasPermi="['ims:user:admin']">分配岗位</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-check" @click.native="handleDepartment(scope.row)" v-hasPermi="['ims:user:admin']">分配部门</el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" @click.native="handleDelete(scope.row)" v-hasPermi="['ims:user:delete']">删除</el-dropdown-item>
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

    <!-- 添加或编辑用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入用户姓名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或编辑用户角色对话框 -->
    <el-dialog :title="title" :visible.sync="openRole" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="form.roleIds" multiple placeholder="请选择" @change="change()">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRoleForm">确 定</el-button>
        <el-button @click="cancelRoleForm">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或编辑用户岗位对话框 -->
    <el-dialog :title="title" :visible.sync="openPost" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位" prop="postIds">
          <el-select v-model="form.postIds" multiple placeholder="请选择" @change="change()">
            <el-option
              v-for="item in postList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPostForm">确 定</el-button>
        <el-button @click="cancelPostForm">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或编辑用户部门对话框 -->
    <el-dialog :title="title" :visible.sync="openDepartment" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="部门" prop="departmentIds">
          <treeselect
            v-model="form.departmentIds"
            :options="departmentOptions"
            :normalizer="normalizer"
            :multiple="multiple"
            :show-count="true"
            :flat="true"
            placeholder="选择部门"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDepartmentForm">确 定</el-button>
        <el-button @click="cancelDepartmentForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUsers, getUser, deleteUser, addOrUpdateUser, changeUserStatus, changeUserRoles, changeUserPosts, changeUserDepartments, exportUser } from "@/api/ims/user";
import { listAllRole, listRoleByUserId } from "@/api/ims/role";
import { listAllPost, listPostByUserId } from "@/api/ims/post";
import { listAllDepartment, listDepartmentByUserId } from "@/api/ims/department";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  components: {
    Treeselect
  },
  data() {
    const roleNotBlank = (rule, value, callback) => {
      if (this.form.roleIds.length === 0) {
        callback(new Error("角色不能为空"));
      } else {
        callback();
      }
    };
    const postNotBlank = (rule, value, callback) => {
      if (this.form.postIds.length === 0) {
        callback(new Error("岗位不能为空"));
      } else {
        callback();
      }
    };
    const departmentNotBlank = (rule, value, callback) => {
      if (this.form.departmentIds.length === 0) {
        callback(new Error("部门不能为空"));
      } else {
        callback();
      }
    };
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中数组
      names: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 用户角色数据
      roleList: [],
      // 用户岗位数据
      postList: [],
      // 用户部门数据
      departmentOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（角色）
      openRole: false,
      // 是否显示弹出层（岗位）
      openPost: false,
      // 是否显示弹出层（部门）
      openDepartment: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        username: null,
        name: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "用户邮箱不能为空", trigger: "blur", type: "email" }
        ],
        name: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" }
        ],
        roleIds: [
          { required: true, validator: roleNotBlank, trigger: "blur" }
        ],
        postIds: [
          { required: true, validator: postNotBlank, trigger: "blur" }
        ],
        departmentIds: [
          { required: true, validator: departmentNotBlank, trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();    
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUsers(this.queryParams).then(response => {
        this.userList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 强制更新 this.form.roleIds
    change() { 
      this.$forceUpdate(); 
    },
    // 用户状态编辑
    handleStatusChange(row) {
      let text = row.status === "open" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeUserStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "open" ? "close" : "open";
        });
    },
    /** 转换菜单数据结构 */
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（角色）
    cancelRoleForm() {
      this.openRole = false;
      this.reset();
    },
    // 取消按钮（岗位）
    cancelPostForm() {
      this.openPost = false;
      this.reset();
    },
    // 取消按钮（部门）
    cancelDepartmentForm() {
      this.openDepartment = false;
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
      this.title = "添加用户";
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getUser(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑用户";
      });
    },
    /** 分配角色操作 */
    handleRole(row) {
      this.reset();
      const id = row.id || this.ids;
      listAllRole().then(response => {
        this.roleList = response.data;
      });
      listRoleByUserId(id).then(response => {
        this.form.id = id;
        this.form.roleIds = response.data.map(item => item.id);
        this.openRole = true;
        this.title = "分配角色";
      });
    },
    /** 分配岗位操作 */
    handlePost(row) {
      this.reset();
      const id = row.id || this.ids;
      listAllPost().then(response => {
        this.postList = response.data;
      });
      listPostByUserId(id).then(response => {
        this.form.id = id;
        this.form.postIds = response.data.map(item => item.id);
        this.openPost = true;
        this.title = "分配岗位";
      });
    },
    /** 分配部门操作 */
    handleDepartment(row) {
      this.reset();
      const id = row.id || this.ids;
      listAllDepartment().then(response => {
        this.departmentOptions = this.handleTree(response.data, "id");
      });
      listDepartmentByUserId(id).then(response => {
        this.form.id = id;
        this.form.departmentIds = response.data.map(item => item.id);
        this.openDepartment = true;
        this.title = "分配部门";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addOrUpdateUser(this.form).then(response => {
            this.msgSuccess("保存成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 提交角色按钮 */
    submitRoleForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const roles = this.form.roleIds;
          const optionArray = [];
          Object.keys(roles).forEach((key) =>
            optionArray.push({
              userId: this.form.id,
              roleId: roles[key],
            }),
          );

          changeUserRoles(optionArray).then(response => {
            this.msgSuccess("保存成功");
            this.openRole = false;
          });
        }
      });
    },
    /** 提交岗位按钮 */
    submitPostForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const posts = this.form.postIds;
          const optionArray = [];
          Object.keys(posts).forEach((key) =>
            optionArray.push({
              userId: this.form.id,
              postId: posts[key],
            }),
          );

          changeUserPosts(optionArray).then(response => {
            this.msgSuccess("保存成功");
            this.openPost = false;
          });
        }
      });
    },
    /** 提交部门按钮 */
    submitDepartmentForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const departments = this.form.departmentIds;
          const optionArray = [];
          Object.keys(departments).forEach((key) =>
            optionArray.push({
              userId: this.form.id,
              departmentId: departments[key],
            }),
          );

          changeUserDepartments(optionArray).then(response => {
            this.msgSuccess("保存成功");
            this.openDepartment = false;
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
          return deleteUser(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportUser(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>