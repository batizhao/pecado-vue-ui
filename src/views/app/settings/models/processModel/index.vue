<template>
  <div>
    <action-table
      ref="actionTableRef"
      url="/app/processes"
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
        <action-button actionType="3" @click="handleDel(scope.row.id)" icon="el-icon-delete">删除</action-button>
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
      <add-component ref="addComponentRef" :appId="appId"></add-component>
    </action-dialog>

  </div>
</template>

<script>
import addComponent from './add.vue'
import { addOrEditData, deleteData, changeStatus } from '@/api/app/processModel.js'
export default {
  components: {
    addComponent
  },
  data () {
    return {
      appId: this.$route.params.appId,
      columns: [
        {
          label: '流程定义Key',
          prop: 'processKey'
        },
        {
          label: '流程名称',
          prop: 'name'
        },
        {
          label: '版本',
          prop: 'version'
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
      submitLoading: false
    }
  },
  methods: {
    handleAdd () {
      this.dialogVisible = true
      this.dialogTitle = '新增'
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
        data.appId = this.$route.params.appId
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
    handleStatusChange(row) {
      let text = row.status === "open" ? "启用" : "停用"
      this.$confirm('确认要' + text + '"' + row.name + '"吗?', "警告", {
        type: "warning"
      }).then(function() {
        return changeStatus(row.id, row.status)
      }).then(() => {
        this.msgSuccess(text + "成功")
      }).catch(function() {
        row.status = row.status === "open" ? "close" : "open";
      })
    }
  }
}
</script>
