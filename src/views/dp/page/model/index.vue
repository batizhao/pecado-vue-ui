<template>
  <div class="app-container">
    <action-table
      ref="actionTableRef"
      url="/dp/page/models"
      :columns="columns"
      :conditions="conditions"
    >
      <template v-slot:type="scoped">
        {{getModuleTypeLabel(scoped.row.type)}}
      </template>
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
          <el-dropdown-item icon="el-icon-edit" @click.native="handleDesign(scope.row)">设计</el-dropdown-item>
          <el-dropdown-item icon="el-icon-delete" @click.native="handleDel(scope.row.id)">删除</el-dropdown-item>
        </action-dropdown>
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
      <add-template ref="addTemplateRef" :moduleTypeOptions="moduleTypeOptions"></add-template>
    </action-dialog>
    <!-- 设计 -->
    <Design ref="designRef" :modelData="currentItem" :leftComponents="leftComponents" @refresh="getTableData" />

  </div>
</template>

<script>
import addTemplate from './add.vue'
import Design from '../design'
import { addOrEditTemplate, deleteTemplate, changeFormStatus } from '@/api/dp/page/model.js'
import { deepClone } from '@/components/CodeEditor/utils/index'
import { indexPageComponents, layoutPageComponents, formModelComponents, listModelComponnets } from '@/components/CodeEditor/components/generator/config'
export default {
  components: {
    addTemplate,
    Design
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
          prop: 'type',
          slotName: 'type'
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
          label: '模板名称',
          prop: 'name',
          componentType: 'input'
        },
        // {
        //   label: '模板标识',
        //   prop: 'code',
        //   componentType: 'input'
        // },
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
      currentItem:{},
      moduleTypeOptions: [] // 模板类型选项
    }
  },
  computed: {
    leftComponents () {
      if (this.currentItem.type === 'form') {
        return [
          {
            title: '组件',
            list: formModelComponents
          }
        ]
      } else if (this.currentItem.type === 'index') {
        return [
          {
            title: '展示型组件',
            list: indexPageComponents
          }
        ]
      } else if (this.currentItem.type === 'layout') {
        return [
          {
            title: '布局组件',
            list: layoutPageComponents
          }
        ]
      } else if (this.currentItem.type === 'list') {
        return [
          {
            title: '组件',
            list: listModelComponnets
          }
        ]
      }
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
      this.$nextTick(() => {
        this.$refs.addTemplateRef.form = row
      })
    },
    getTableData() {
      this.$refs.actionTableRef.getTableData()
    },
    dialogConfirm () {
      const data = this.$refs.addTemplateRef.submit()
      if (data) {
        this.submitLoading = true
        addOrEditTemplate(data).then(() => {
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
      this.currentItem = deepClone(item)
      this.currentItem.pageMetadata = JSON.parse(this.currentItem.pageMetadata) || {}
      this.$nextTick(() => {
        this.$refs.designRef.open()
      })
    },
    getModuleTypeOptions () {
      const data = [
        {
          label: '布局',
          value: 'layout'
        },
        {
          label: '主页模型',
          value: 'index'
        },
        {
          label: '列表模型',
          value: 'list'
        },
        {
          label: '表单模型',
          value: 'form'
        }
      ]
      const index = this.conditions.findIndex(item => item.prop === 'type')
      this.moduleTypeOptions = this.conditions[index].options = data
    },
    getModuleTypeLabel (value) {
      const res = this.moduleTypeOptions.find(item => item.value === value)
      return  res ? res.label : value
    },
    handleStatusChange(row) {
      let text = row.status === "open" ? "启用" : "停用"
      this.$confirm('确认要' + text + '"' + row.name + '"吗?', "警告", {
        type: "warning"
      }).then(function() {
        return changeFormStatus(row.id, row.status)
      }).then(() => {
        this.msgSuccess(text + "成功")
      }).catch(function() {
        row.status = row.status === "open" ? "close" : "open";
      })
    }
  }
}
</script>
