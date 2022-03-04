<template>
  <div>
    <div class="action-buttons mb8">
      <action-button @click="handleAdd" actionType="1">新增</action-button>
      <action-button @click="handleImport" icon="el-icon-folder-opened" type="info">从数据库加载</action-button>
      <action-button @click="handleDel" actionType="2">删除</action-button>
    </div>
    <action-table ref="actionTableRef" url="/app/tables" :columns="columns" :otherParams="{ appId }">
      <template v-slot:status="scope">
        {{getModelStatusLabel(scope.row.status)}}
      </template>
      <template v-slot:action="scope">
        <action-button actionType="3" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</action-button>
        <action-dropdown>
            <el-dropdown-item icon="el-icon-download" @click.native="generateCode(scope.row)" v-if="scope.row.status === 'synced'">生成代码</el-dropdown-item>
            <el-dropdown-item icon="el-icon-view" @click.native="previewCode(scope.row.id)" v-if="scope.row.status === 'synced'">预览代码</el-dropdown-item>
            <el-dropdown-item icon="el-icon-refresh" @click.native="syncEntityModel(scope.row.id)" v-if="['created', 'nosync'].includes(scope.row.status)">同步实体表</el-dropdown-item>
            <el-dropdown-item icon="el-icon-delete" @click.native="handleDel(scope.row.id)">删除</el-dropdown-item>
        </action-dropdown>
      </template>
    </action-table>
    <!-- 新增编辑弹窗 -->
    <action-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :loading="submitLoading"
      width="80%"
      @confirm="dialogConfirm"
    >
      <add-model ref="addModelRef"></add-model>
    </action-dialog>
    <!-- 生成代码弹窗 -->
    <action-dialog
      v-model="generateCodeVisible"
      title="生成代码"
      :loading="submitLoading"
      @confirm="generateCodeSubmit"
      :showFooter="false"
      width="70%"
    >
      <generate-code
        v-if="generateCodeVisible"
        ref="generateCodeRef"
        isDialog
        :entityModelId="currentId"
        @success="generaCodeSuccess"
      >
      </generate-code>
    </action-dialog>
    <!-- 预览代码弹窗 -->
    <preview-code-dialog ref="previewCodeDialogRef"></preview-code-dialog>
    <!-- 从数据库加载弹窗 -->
    <import-meta ref="importMetaRef" :appId="appId" @ok="getTableData"></import-meta>
  </div>
</template>

<script>
import addModel from './add.vue'
import { addOrEditEntityModel, deleteEntityModel, syncEntityModel } from '@/api/app/dataModel.js'
import generateCode from './editMeta.vue'
import PreviewCodeDialog from './previewCodeDialog.vue'
import ImportMeta from './importMeta.vue'
export default {
  components: {
    addModel,
    generateCode,
    PreviewCodeDialog,
    ImportMeta
  },
  data () {
    return {
      appId: this.$route.params.appId,
      columns: [
        {
          prop: 'tableName',
          label: '表名称',
        },
        {
          prop: 'tableComment',
          label: '表描述'
        },
        {
          prop: 'dsName',
          label: '数据源'
        },
        {
          prop: 'status',
          label: '实体表状态',
          slotName: 'status',
          width: 120
        }
      ],
      dialogVisible: false,
      dialogTitle: '',
      submitLoading: false,
      generateCodeVisible: false,
      currentId: '',
      modelStatusOptions: []
    }
  },
  created () {
    this.listDictDataByCode('table_sync_status').then(res => {
      this.modelStatusOptions = res.data
    })
  },
  methods: {
    getTableData() {
      this.$refs.actionTableRef.getTableData()
    },
    handleAdd () {
      this.dialogVisible = true
      this.dialogTitle = '新增数据模型'
      this.$nextTick(() => {
        this.$refs.addModelRef.reset()
      })
    },
    handleEdit (row) {
      const rowCopy = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.dialogTitle = '编辑'
      this.$nextTick(() => {
        this.$refs.addModelRef.form = rowCopy
        this.$refs.addModelRef.tableDefaultData = JSON.parse(rowCopy.columnMetadata)
      })
    },
    handleDel (id) {
      const ids = id || this.$refs.actionTableRef.getSelectedIds()
      if (!ids) return
      this.$confirm('确认删除?', "提示", {
        type: "warning"
      }).then(() => {
        deleteEntityModel(ids).then(() => {
          this.msgSuccess("删除成功")
          this.getTableData()
        })
      }).catch(() => {})
    },
    async dialogConfirm () {
      const res = await this.$refs.addModelRef.submit()
      this.dialogVisible = false
      this.submitLoading = true
      const formData = res[0]
      const tableData = res[1]
      formData.columnMetadata = JSON.stringify(tableData)
      formData.appId = this.appId
      addOrEditEntityModel(formData).then(() => {
        this.submitLoading = false
        this.getTableData()
        this.msgSuccess(this.dialogTitle + '成功')
      }).catch(() =>{
        this.submitLoading = false
      })
    },
    generateCode (row) {
      this.generateCodeVisible = true
      this.currentId = row.id
    },
    generateCodeSubmit () {
      this.$refs.generateCodeRef.submitForm()
    },
    getModelStatusLabel (value) {
      const res = this.modelStatusOptions.find(item => item.value === value)
      return  res ? res.label : value
    },
    generaCodeSuccess () {
      this.generateCodeVisible = false
      this.getTableData()
    },
    syncEntityModel (id) {
      this.$confirm('确认同步实体表?', '提示', {
        type: 'warning'
      }).then(() => {
        syncEntityModel(id).then(() => {
          this.msgSuccess('同步成功')
          this.getTableData()
        })
      }).catch(() => {})
    },
    previewCode (id) {
      this.$refs.previewCodeDialogRef.open(id)
    },
    handleImport () {
      this.$refs.importMetaRef.show();
    }
  }

}
</script>
