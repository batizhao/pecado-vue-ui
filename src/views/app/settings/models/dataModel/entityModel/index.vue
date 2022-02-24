<template>
  <div>
    <div class="action-buttons mb8">
      <action-button @click="handleAdd" actionType="1">新增</action-button>
      <action-button @click="handleImport" icon="el-icon-folder-opened" type="info">从数据库加载</action-button>
      <action-button @click="handleDel" actionType="2">删除</action-button>
    </div>
    <action-table ref="actionTableRef" url="/app/tables" :columns="columns">
      <template v-slot:status="scope">
        {{getModelStatusLabel(scope.row.status)}}
      </template>
      <template v-slot:action="scope">
        <action-button actionType="3" @click="handleEdit(scope.row)">编辑</action-button>
        <action-button actionType="3" @click="generateCode(scope.row)" v-if="scope.row.status === 'synced'">生成代码</action-button>
        <action-button actionType="3" @click="syncEntityModel(scope.row.id)" v-if="['created', 'nosync'].includes(scope.row.status)">同步实体表</action-button>
        <action-button actionType="3" @click="previewCode(scope.row.id)">预览代码</action-button>
        <action-button actionType="3" @click="handleDel(scope.row.id)">删除</action-button>
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
    <import-meta ref="impotMetaRef" @ok="getTableData"></import-meta>
  </div>
</template>

<script>
import addModel from './add.vue'
import { addOrEditEntityModel, deleteEntityModel, syncEntityModel } from '@/api/app/dataModel.js'
import generateCode from '@/views/dp/code/editMeta.vue'
import PreviewCodeDialog from '@/views/dp/code/previewCodeDialog.vue'
import ImportMeta from '@/views/dp/code/importMeta.vue'
export default {
  components: {
    addModel,
    generateCode,
    PreviewCodeDialog,
    ImportMeta
  },
  data () {
    return {
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
      this.dialogTitle = '新增'
      this.$nextTick(() => {
        this.$refs.addModelRef.reset()
      })
    },
    handleEdit (row) {
      const rowCopy = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.dialogTitle = '编辑'
      this.$nextTick(() => {
        rowCopy.columnMetadata = JSON.parse(rowCopy.columnMetadata)
        this.$refs.addModelRef.form = rowCopy
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
    dialogConfirm () {
      const data = this.$refs.addModelRef.submit()
      if (data) {
        this.dialogVisible = false
        this.submitLoading = true
        data.appId = this.$route.params.appId
        addOrEditEntityModel(data).then(() => {
          this.submitLoading = false
          this.getTableData()
        }).catch(() =>{
          this.submitLoading = false
        })
      }
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
      this.$refs.impotMetaRef.show();
    }
  }

}
</script>
