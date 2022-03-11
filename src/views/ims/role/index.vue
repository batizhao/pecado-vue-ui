<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item :label="$t('role.name')" prop="name">
        <el-input
          v-model="queryParams.name"
          :placeholder="$t('role.namePlaceholder')"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{$t('search')}}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{$t('reset')}}</el-button>
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
          v-hasPermi="['ims:role:add']"
        >{{$t('add')}}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ims:role:edit']"
        >{{$t('edit')}}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ims:role:delete']"
        >{{$t('delete')}}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ims:role:export']"
        >{{$t('export')}}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('role.name')" align="center" prop="name" />
      <el-table-column :label="$t('role.code')" align="center" prop="code" />
      <el-table-column :label="$t('role.description')" align="center" prop="description" />
      <el-table-column :label="$t('role.status')" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="handleStatusChange(scope.row)"
            active-value="open"
            inactive-value="close"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('role.createTime')" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('option')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ims:role:edit']"
          >{{$t('edit')}}</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
               {{$t('more')}} <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-circle-check" @click.native="handleMenu(scope.row)" v-hasPermi="['ims:role:admin']">{{$t('role.menu')}}</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-check" @click.native="handleDataScope(scope.row)" v-hasPermi="['ims:role:admin']">{{$t('role.dataScope')}}</el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" @click.native="handleDelete(scope.row)" v-hasPermi="['ims:role:delete']">{{$t('delete')}}</el-dropdown-item>
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

    <!-- 添加或编辑角色对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item :label="$t('role.name')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('role.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('role.code')" prop="code">
          <el-input v-model="form.code" :placeholder="$t('role.codePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('role.description')" prop="description">
          <el-input v-model="form.description" :placeholder="$t('role.descriptionPlaceholder')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{$t('confirm')}}</el-button>
        <el-button @click="cancel">{{$t('cancel')}}</el-button>
      </div>
    </el-dialog>

    <!-- 添加或编辑角色菜单对话框 -->
    <el-dialog :title="title" :visible.sync="openMenu" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('role.name')">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item :label="$t('role.adminMenu')" prop="menuIds">
          <el-tree
            class="tree-border"
            :data="adminMenuList"
            show-checkbox
            ref="adminMenu"
            node-key="id"
            :check-strictly="true"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item :label="$t('role.dashboardMenu')" prop="menuIds">
          <el-tree
            class="tree-border"
            :data="dashboardMenuList"
            show-checkbox
            ref="dashboardMenu"
            node-key="id"
            :check-strictly="true"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMenuForm">{{$t('confirm')}}</el-button>
        <el-button @click="cancelMenuForm">{{$t('cancel')}}</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('role.name')">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item :label="$t('role.dataScope')">
          <el-select v-model="form.dataScope">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('role.dept')" v-show="form.dataScope === 'custom'">
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="true"
            empty-text="loading..."
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">{{$t('confirm')}}</el-button>
        <el-button @click="cancelDataScope">{{$t('cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, deleteRole, addOrUpdateRole, changeRoleStatus, changeRoleMenus, changeDataScope } from "@/api/ims/role";
import { listMenusByRoleId, listAdminMenu, listDashboardMenu } from "@/api/ims/menu";
import { listAllDepartment, listDepartmentByRoleId } from "@/api/ims/department";
import { downLoadExcel } from "@/utils/download";

export default {
  name: "Role",
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
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 角色菜单数据
      adminMenuList: [],
      // 角色菜单数据
      dashboardMenuList: [],
      // 部门列表
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（菜单）
      openMenu: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "all",
          label: "全部数据权限"
        },
        {
          value: "custom",
          label: "自定数据权限"
        },
        {
          value: "dept",
          label: "本部门数据权限"
        },
        {
          value: "sub",
          label: "本部门及以下数据权限"
        },
        {
          value: "oneself",
          label: "仅本人数据权限"
        }
      ],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        name: null,
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "name"
      },
      //表单校验
      rules: {
        name: [
          { required: true, message: this.$t('role.nameNotBlank'), trigger: "blur" }
        ],
        code: [
          { required: true, message: this.$t('role.codeNotBlank'), trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.queryParams).then(response => {
        this.roleList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      return this.$refs.adminMenu.getCheckedKeys().concat(this.$refs.dashboardMenu.getCheckedKeys());
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      return this.$refs.dept.getCheckedKeys();
    },
    // 数据源状态编辑
    handleStatusChange(row) {
      let text = row.status === "open" ? this.$t('open') : this.$t('close');
      this.$confirm(this.$t('confirm') + ' ' + text + ' "' + row.name + '"?', this.$t('warn'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: "warning"
        }).then(function() {
          return changeRoleStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + ' ' + this.$t('success'));
        }).catch(function() {
          row.status = row.status === "open" ? "close" : "open";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（角色）
    cancelMenuForm() {
      this.openMenu = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
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
      this.title = this.$t('role.addRole');
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRole(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t('role.eidtRole');
      });
    },
    /** 分配菜单操作 */
    handleMenu(row) {
      this.reset();
      const id = row.id;
      listAdminMenu().then(response => {
        this.adminMenuList = response.data;
      });
      listDashboardMenu().then(response => {
        this.dashboardMenuList = response.data;
      });
      const menus = listMenusByRoleId(id);
      this.$nextTick(() => {
        menus.then(res => {
          this.$refs.adminMenu.setCheckedKeys(res.data.map(item => item.id));
          this.$refs.dashboardMenu.setCheckedKeys(res.data.map(item => item.id));
        });
      });
      this.form = row;
      this.openMenu = true;
      this.title = this.$t('role.menu');
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset();
      const id = row.id;
      listAllDepartment().then(response => {
        this.deptOptions = response.data;
      });
      const departments = listDepartmentByRoleId(id);
      this.$nextTick(() => {
        departments.then(res => {
          this.$refs.dept.setCheckedKeys(res.data.map(item => item.id));
        });
      });
      this.form = row;
      this.openDataScope = true;
      this.title = this.$t('role.dataScope');
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addOrUpdateRole(this.form).then(response => {
            this.msgSuccess(this.$t('submitMessage'));
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 提交菜单按钮 */
    submitMenuForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const menus = this.getMenuAllCheckedKeys();
          const optionArray = [];
          Object.keys(menus).forEach((key) =>
            optionArray.push({
              roleId: this.form.id,
              menuId: menus[key],
            }),
          );

          changeRoleMenus(optionArray).then(response => {
            this.msgSuccess(this.$t('submitMessage'));
            this.openMenu = false;
          });
        }
      });
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const depts = this.getDeptAllCheckedKeys();
          const optionArray = [];
          Object.keys(depts).forEach((key) =>
            optionArray.push({
              roleId: this.form.id,
              departmentId: depts[key],
            }),
          );

          this.form.roleDepartments = optionArray;
          changeDataScope(this.form).then(response => {
            this.msgSuccess(this.$t('submitMessage'));
            this.openDataScope = false;
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const names = row.name || this.names;
      this.$confirm(this.$t('deleteConfirmMessage') + ' "' + names + '"?', this.$t('warn'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: "warning"
      }).then(function() {
        return deleteRole(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess(this.$t('deleteMessage'));
      }).catch(error => {
        reject(error)
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm(this.$t('exportConfirmMessage'), this.$t('warn'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: "warning"
      }).then(function() {
        downLoadExcel("/ims/role/export", queryParams);
      })
    }
  }
};
</script>