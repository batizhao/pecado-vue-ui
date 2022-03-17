<template>
  <div>
    <div class="mb8">
      <action-button actionType="1" @click="handleAdd">新增</action-button>
      <action-button actionType="2" @click="handleDel">删除</action-button>
    </div>
    <action-edit-table
      ref="actionEditTableRef"
      :defaultData="newDefaultData"
      :tableColumns="tableColumns"
      showSelection
    ></action-edit-table>
  </div>
</template>

<script>
export default{
  props: {
    defaultData: Array
  },
  computed: {
    newDefaultData () {
      if (this.defaultData && this.defaultData.length) {
        return this.defaultData
      } else {
        return [
          { operType: 'create', name: '新增', style: 'text', icon: 'el-icon-plus' },
          { operType: 'edit', name: '编辑', style: 'text', icon: 'el-icon-edit' },
          { operType: 'delete', name: '删除', style: 'text', icon: 'el-icon-delete' },
          { operType: 'batchDelete', name: '批量删除', style: 'text', icon: 'el-icon-delete' }
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
          prop: 'icon'
        },
        {
          label: '请求地址',
          prop: 'addr'
        }
      ]
    }
  },
  methods: {
    handleAdd () {
      this.$refs.actionEditTableRef.addRow()
    },
    handleDel () {
      this.$refs.actionEditTableRef.deleteRow()
    }
  }
}
</script>
