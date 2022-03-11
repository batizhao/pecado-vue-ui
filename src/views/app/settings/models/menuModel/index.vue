<template>
  <div>
    <action-table
      ref="actionTableRef"
      url="/app/menu"
      :columns="columns"
      :otherParams="{ appId }"
      :showPagination="false"
      :showSelection="false"
      :showNumber="false"
    >
      <template v-slot:status="scope">
        <el-switch
          v-model="scope.row.status"
          @change="handleStatusChange(scope.row)"
          active-value="open"
          inactive-value="close"
        ></el-switch>
      </template>
      <template v-slot:icon="scope">
        <svg-icon :icon-class="scope.row.icon" />
      </template>
      <template slot="actionButtons">
        <div class="action-buttons mb8">
          <action-button @click="handleAdd" actionType="1">新增</action-button>
        </div>
      </template>
      <template v-slot:action="scope">
        <action-button actionType="3" @click="handleAdd(scope.row)" icon="el-icon-plus">新增</action-button>
        <action-button actionType="3" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</action-button>
        <action-button actionType="3" @click="handleDel(scope.row)" icon="el-icon-delete">删除</action-button>
      </template>
    </action-table>

    <!-- 新增编辑弹窗 -->
    <action-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :loading="submitLoading"
      @confirm="dialogConfirm"
      width="30%"
    >
      <add-component ref="addComponentRef"></add-component>
    </action-dialog>
  </div>
</template>

<script>
import addComponent from './add.vue'
import { deleteMenu, addOrUpdateMenu, changeMenuStatus } from '@/api/ims/menu.js'
export default {
  components: {
    addComponent,
  },
  data () {
    return {
      appId: this.$route.params.appId,
      columns: [
        {
          label: '名称',
          prop: 'name'
        },
        {
          label: '图标',
          prop: 'icon',
          slotName: 'icon'
        },
        {
          label: '排序',
          prop: 'sort'
        },
        {
          label: '权限',
          prop: 'permission',
        },
        {
          label: '路由地址',
          prop: 'path'
        },
        {
          label: '状态',
          prop: 'status',
          width: 100,
          slotName: 'status'
        },
        {
          prop: 'createTime',
          label: '创建时间'
        }
      ],
      dialogVisible: false,
      dialogTitle: '',
      submitLoading: false,
    }
  },
  methods: {
    handleAdd (row) {
      this.dialogVisible = true
      this.dialogTitle = '新增应用菜单'
      this.$nextTick(() => {
        this.$refs.addComponentRef.reset()
      })
    },
    handleDel (row) {
      this.$confirm('确认删除"' + row.name + '"吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteMenu(row.id).then(() => {
          this.msgSuccess("删除成功")
          this.getTableData()
        })
      }).catch(() => {})
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑应用菜单'
      const rowCopy = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.addComponentRef.form = rowCopy
      })
    },
    getTableData() {
      this.$refs.actionTableRef.getTableData()
    },
    dialogConfirm () {
      const data = this.$refs.addComponentRef.submit()
      if (data) {
        this.submitLoading = true
        data.appId = this.appId
        addOrUpdateMenu(data).then(() => {
          this.msgSuccess(this.dialogTitle + '成功')
          this.submitLoading =false
          this.dialogVisible = false
          this.getTableData()
        }).catch(() => {
          this.submitLoading =false
        })
        
      }
    },
    // 表单状态编辑
    handleStatusChange(row) {
      let text = row.status === "open" ? "启用" : "停用";
      this.$confirm('确认要' + text + '"' + row.name + '"吗?', "警告", {
        type: "warning"
      }).then(function() {
        return changeMenuStatus(row.id, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "open" ? "close" : "open";
      });
    },
  }
}
</script>
