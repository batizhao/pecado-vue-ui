<template>
  <div>
    <action-table
      ref="actionTableRef"
      url="/app/forms"
      :columns="columns"
      :otherParams="{ appId }"
    >
      <template v-slot:status="scope">
        <el-switch
          v-model="scope.row.status"
          @change="handleStatusChange(scope.row)"
          active-value="open"
          inactive-value="close"
        ></el-switch>
      </template>
      <template slot="actionButtons">
        <div class="action-buttons mb8">
          <action-button @click="handleAdd" actionType="1">新增</action-button>
          <action-button @click="handleDel" actionType="2">删除</action-button>
        </div>
      </template>
      <template v-slot:action="scope">
        <action-button actionType="3" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</action-button>
        <action-dropdown>
          <el-dropdown-item icon="el-icon-edit" @click.native="handleDesign(scope.row)">表单设计</el-dropdown-item>
          <el-dropdown-item icon="el-icon-view" @click.native="handleView(scope.row)">版本</el-dropdown-item>
          <el-dropdown-item icon="el-icon-delete" @click.native="handleDel(scope.row.id)">删除</el-dropdown-item>
        </action-dropdown>
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

    <!-- 设计表单弹窗 -->
    <action-dialog
      v-model="designFormVisible"
      :title="'设计表单-' + currentItem.name"
      fullscreen
      custom-class="form-design-dialog"
      :showFooter="false"
    >
      <design-form
        v-if="designFormVisible"
        ref="designFormRef"
        :formInfo="currentItem"
        @success="designFormSuccess"
      ></design-form>
    </action-dialog>

    <!-- 版本弹窗 -->
    <action-dialog
      v-model="versionVisible"
      :title="'版本-' + currentItem.name"
      :showFooter="false"
      width="70%"
    >
      <form-version v-if="versionVisible" :formKey="currentItem.formKey"></form-version>
    </action-dialog>


  </div>
</template>

<script>
import addComponent from './add.vue'
import { addOrEditData, deleteData, changeFormStatus } from '@/api/app/formModel.js'
import designForm from './design.vue'
import formVersion from './version.vue'
export default {
  components: {
    addComponent,
    designForm,
    formVersion
  },
  data () {
    return {
      appId: this.$route.params.appId,
      columns: [
        {
          label: '表单名称',
          prop: 'name'
        },
        {
          label: '表单标识',
          prop: 'formKey',
        },
        {
          label: '表单描述',
          prop: 'description'
        },
        {
          label: '表单状态',
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
      designFormVisible: false,
      currentItem: {},
      versionVisible: false
    }
  },
  methods: {
    handleAdd () {
      this.dialogVisible = true
      this.dialogTitle = '新增表单模型'
      this.$nextTick(() => {
        this.$refs.addComponentRef.reset()
      })
    },
    handleDel (id) {
      const ids = id || this.$refs.actionTableRef.getSelectedIds()
      if (!ids) return
      this.$confirm('确认删除?', "提示", {
        type: "warning"
      }).then(() => {
        deleteData(ids).then(() => {
          this.msgSuccess("删除成功")
          this.getTableData()
        })
      }).catch(() => {})
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑'
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
        addOrEditData(data).then(() => {
          this.msgSuccess(this.dialogTitle + '成功')
          this.submitLoading =false
          this.dialogVisible = false
          this.getTableData()
        }).catch(() => {
          this.submitLoading =false
        })
        
      }
    },
    handleDesign (item) {
      this.designFormVisible = true
      this.currentItem = item
    },
    designFormSuccess () {
      this.designFormVisible = false
    },
    // 表单状态编辑
    handleStatusChange(row) {
      let text = row.status === "open" ? "启用" : "停用";
      this.$confirm('确认要' + text + '"' + row.name + '"吗?', "警告", {
        type: "warning"
      }).then(function() {
        return changeFormStatus(row.id, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "open" ? "close" : "open";
      });
    },
    // 版本浏览
    handleView (item) {
      this.versionVisible = true
      this.currentItem = item
    }
  }
}
</script>
<style lang="scss">
.form-design-dialog>.el-dialog__body{
  padding: 0;
  border-top: 1px solid #f1e8e8;
  height: calc(100vh - 54px);
  .app-container{
    height: 100%;
    overflow: hidden;
    padding: 0;
  }
}
</style>
