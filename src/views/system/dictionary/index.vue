<template>
  <div class="app-container">
    <action-table
      ref="actionTableRef"
      url="/system/dictionaries"
      :columns="columns"
      :conditions="conditions"
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
      width="60%"
      @confirm="dialogConfirm"
    >
      <add-template ref="addDictionaryRef"></add-template>
    </action-dialog>
  </div>
</template>

<script>
import addTemplate from './add.vue'
import { addOrUpdateDictionary, deleteDictionary, changeDictionaryStatus } from '@/api/system/dictionary.js'
export default {
  components: {
    addTemplate,
  },
  data () {
    return {
      columns: [
        {
          label: '名称',
          prop: 'name'
        },
        {
          label: '标识',
          prop: 'code',
        },
        {
          label: '状态',
          prop: 'status',
          slotName: 'status'
        },
        {
          prop: 'createTime',
          label: '创建时间'
        }
      ],
      conditions: [
        {
          label: '名称',
          prop: 'name',
          componentType: 'input'
        }
      ],
      dialogVisible: false,
      dialogTitle: '',
      submitLoading: false,
      currentItem:{},
      moduleTypeOptions: [] // 模板类型选项
    }
  },
  methods: {
    handleAdd () {
      this.dialogVisible = true
      this.dialogTitle = '新增'
      this.$nextTick(() => {
        this.$refs.addDictionaryRef.reset()
      })
    },
    handleDel (id) {
      const ids = id || this.$refs.actionTableRef.getSelectedIds()
      if (!ids) return
      this.$confirm('确认删除?', "提示", {
        type: "warning"
      }).then(() => {
        deleteDictionary(ids).then(() => {
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
        rowCopy.data = JSON.parse(rowCopy.data)
        this.$refs.addDictionaryRef.form = rowCopy
      })
    },
    getTableData() {
      this.$refs.actionTableRef.getTableData()
    },
    async dialogConfirm () {
      const res = await this.$refs.addDictionaryRef.submit()
      const formData = JSON.parse(JSON.stringify(res[0]))
      const tableData = res[1]
      formData.data = JSON.stringify(tableData)
      this.submitLoading = true
      addOrUpdateDictionary(formData).then(() => {
        this.msgSuccess(this.dialogTitle + '成功')
        this.submitLoading =false
        this.dialogVisible = false
        this.getTableData()
      }).catch(() => {
        this.submitLoading =false
      })
    },
    handleStatusChange(row) {
      let text = row.status === "open" ? "启用" : "停用"
      this.$confirm('确认要' + text + '"' + row.name + '"吗?', "警告", {
        type: "warning"
      }).then(function() {
        return changeDictionaryStatus(row.id, row.status)
      }).then(() => {
        this.msgSuccess(text + "成功")
      }).catch(function() {
        row.status = row.status === "open" ? "close" : "open";
      })
    }
  }
}
</script>
