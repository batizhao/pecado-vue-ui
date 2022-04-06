<template>
  <div>
    <div class="mb8">
      <action-button actionType="1" @click="handleAdd">新增</action-button>
      <action-button actionType="2" @click="handleDel">删除</action-button>
    </div>
    <action-edit-table
      ref="actionEditTableRef"
      showSelection
      :defaultData="newDefaultData"
      :tableColumns="tableColumns"
      :operationColumn="{ show: true, movable: true }"
    >
      <!-- 图标选择 -->
      <template v-slot:icon="scope">
        <el-input v-model="scope.row.icon" size="mini" @focus="$refs.fontAwesomeSelectorRef.open()">
        </el-input>
        <font-awesome-selector ref="fontAwesomeSelectorRef" v-model="scope.row.icon"></font-awesome-selector>
      </template>
      <!-- 关联页面 -->
      <template v-slot:page="scope">
        <el-badge is-dot v-if="scope.row.page">
          <el-button size="mini" @click="associatePage(scope)">配置</el-button>
        </el-badge>
        <el-button v-else size="mini" @click="associatePage(scope)" :disabled="!['create', 'edit', 'detail'].includes(scope.row.operType)">配置</el-button>
        <action-dialog
          v-model="associatePageVisible"
          title="关联页面"
          width="30%"
          @confirm="submitAssociatePage"
        >
          <action-form
            :model="associatePageFormModel"
            :formOptions="associatePageFormOptions"
            :span="24"
          >
          </action-form>
        </action-dialog>
      </template>
    </action-edit-table>
  </div>
</template>

<script>
import FontAwesomeSelector from '@/components/FontAwesomeSelector/index.vue'
import { getAssociatePageOption, getAssociatePageDataList, getCurrentAppPageType } from '../../menuModel/associatePage.js'
export default{
  props: {
    defaultData: Array
  },
  components: {
    FontAwesomeSelector
  },
  computed: {
    newDefaultData () {
      if (this.defaultData && this.defaultData.length) {
        return this.defaultData
      } else {
        return [
          // { operType: 'create', name: '新增', style: 'text', icon: 'el-icon-plus', position: 'outside' },
          // { operType: 'edit', name: '编辑', style: 'text', icon: 'el-icon-edit', position: 'inside' },
          // { operType: 'detail', name: '详情', style: 'text', icon: 'el-icon-view', position: 'inside' },
          // { operType: 'delete', name: '删除', style: 'text', icon: 'el-icon-delete', position: 'inside' },
          // { operType: 'batchDelete', name: '批量删除', style: 'text', icon: 'el-icon-delete', position: 'inside' }
        ]
      }

    }
  },
  data () {
    return {
      tableColumns: [
        {
          label: '操作类型',
          prop: 'operType',
          type: 'select',
          options: [
            { value: 'create', label: '新增' },
            { value: 'edit', label: '编辑' },
            { value: 'detail', label: '详情' },
            { value: 'delete', label: '删除' },
            { value: 'batchDelete', label: '批量删除' }
          ],
          rules: [
            { required: true, trigger: 'change', message: '请选择' }
          ]
        },
        {
          label: '按钮名称',
          prop: 'name',
          rules: [
            { required: true, trigger: 'change', message: '请输入' }
          ]
        },
        {
          label: '按钮样式',
          prop: 'style',
          type: 'select',
          options: [
            { value: 'primary' },
            { value: 'success' },
            { value: 'info' },
            { value: 'warning' },
            { value: 'danger' },
            { value: 'text' }
          ],
          defaultValue: 'text',
          rules: [
            { required: true, trigger: 'change', message: '请选择' }
          ]
        },
        {
          label: '按钮图标',
          prop: 'icon',
          type: 'slot'
        },
        {
          label: '按钮位置',
          prop: 'position',
          type: 'select',
          options: [
            {
              value: 'outside', label: '表格外'
            },
            {
              value: 'inside', label: '操作列'
            }
          ]
        },
        {
          label: '关联页面',
          prop: 'page',
          type: 'slot',
          slotName: 'page'
        }
      ],
      currentRowIndex: 0,
      associatePageVisible: false,
      associatePageFormModel: {
        appPageCode: '',
        pageModelCode: '',
        currentAppPageType: ''
      },
      associatePageFormOptions: [
        ...getAssociatePageOption.call(this, 'associatePageFormModel'),
      ],
      appId: this.$route.params.appId
    }
  },
  created () {
    getAssociatePageDataList.call(this, 'associatePageFormModel', 'associatePageFormOptions')
  },
  methods: {
    handleAdd () {
      this.$refs.actionEditTableRef.addRow()
    },
    handleDel () {
      this.$refs.actionEditTableRef.deleteRow()
    },
    associatePage ({ row, index }) {
      this.currentRowIndex = index
      const { appPageCode, pageModelCode } = row.page || {}
      this.associatePageFormModel.appPageCode = appPageCode || ''
      this.associatePageFormModel.pageModelCode = pageModelCode || ''
      getCurrentAppPageType.call(this, 'associatePageFormModel', 'associatePageFormOptions')
      this.associatePageVisible = true
    },
    submitAssociatePage () {
      const { appPageCode, pageModelCode } = this.associatePageFormModel
      this.$refs.actionEditTableRef.form.data[this.currentRowIndex].page = {
        appPageCode,
        pageModelCode,
        appId: this.appId
      }
      this.associatePageVisible = false
    }
  }
}
</script>
