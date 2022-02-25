<template>
  <div class="app-container">
    <action-table
      ref="actionTableRef"
      url="/dp/page/models"
      :columns="columns"
      :conditions="conditions"
    >
      <template slot="actionButtons">
        <div class="action-buttons mb8">
          <action-button @click="handleAdd" actionType="1">新增</action-button>
          <action-button @click="handleDel" actionType="2">删除</action-button>
        </div>
      </template>
      <template v-slot:action="scope">
        <action-button actionType="3" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</action-button>
        <action-dropdown>
          <el-dropdown-item icon="el-icon-edit" @click.native="handleDesign(scope.row.id)">设计</el-dropdown-item>
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
      <add-template ref="addTemplateRef" :moduleTypeOptions="moduleTypeOptions"></add-template>
    </action-dialog>

  </div>
</template>

<script>
import addTemplate from './add.vue'
import { addOrEditTemplate, deleteTemplate } from '@/api/dp/page/model.js'
export default {
  components: {
    addTemplate
  },
  data () {
    return {
      columns: [
        {
          label: '模板名称',
          prop: 'name'
        },
        {
          label: '模板标识',
          prop: 'code',
        },
        {
          label: '模板类型',
          prop: 'type'
        }
      ],
      conditions: [
        {
          label: '模板名称',
          prop: 'name',
          componentType: 'input'
        },
        {
          label: '模板标识',
          prop: 'code',
          componentType: 'input'
        },
        {
          label: '模板类型',
          prop: 'type',
          componentType: 'select',
          options: []
        }
      ],
      dialogVisible: false,
      dialogTitle: '',
      submitLoading: false,
      moduleTypeOptions: [] // 模板类型选项
    }
  },
  created () {
    this.getModuleTypeOptions()
  },
  methods: {
    handleAdd () {
      this.dialogVisible = true
      this.dialogTitle = '新增'
      this.$nextTick(() => {
        this.$refs.addTemplateRef.reset()
      })
    },
    handleDel (id) {
      const ids = id || this.$refs.actionTableRef.getSelectedIds()
      if (!ids) return
      this.$confirm('确认删除?', "提示", {
        type: "warning"
      }).then(() => {
        deleteTemplate(ids).then(() => {
          this.msgSuccess("删除成功")
          this.getTableData()
        })
      }).catch(() => {})
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑'
    },
    getTableData() {
      this.$refs.actionTableRef.getTableData()
    },
    dialogConfirm () {
      const data = this.$refs.addTemplateRef.submit()
      if (data) {
        this.submitLoading = true
        addOrEditTemplate(data).then(() => {
          this.msgSuccess('新增成功')
          this.submitLoading =false
          this.dialogVisible = false
          this.getTableData()
        }).catch(() => {
          this.submitLoading =false
        })
        
      }
    },
    handleDesign (id) {

    },
    getModuleTypeOptions () {
      const data = [
        {
          label: '类型1',
          value: 1
        },
        {
          label: '类型2',
          value: 2
        }
      ]
      const index = this.conditions.findIndex(item => item.prop === 'type')
      this.moduleTypeOptions = this.conditions[index].options = data
    }
  }
}
</script>
