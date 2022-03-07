<template>
  <div>
    <action-edit-table
      ref="actionEditTableRef"
      :defaultData="newDefaultData"
      :tableColumns="tableColumns"
    ></action-edit-table>
  </div>
</template>

<script>
export default {
  props: {
    defaultData: Array
  },
  watch: {
    defaultData () {
      this.setDefaultData()
    }
  },
  data () {
    return {
      tableColumns: [
        {
          label: '列标识',
          prop: 'code',
          readonly: true
        },
        {
          label: '列名称',
          prop: 'name',
          readonly: true
        },
        {
          label: '显示',
          prop: 'display',
          type: 'checkbox',
          rules: [
            { required: true }
          ]
        },
        {
          label: '显示类型',
          prop: 'showType',
          type: 'select',
          options: [
            {
              label: '单行文本',
              value: 'text'
            },
            {
              label: '数字',
              value: 'number'
            },
            {
              label: '日期',
              value: 'datetime'
            },
            {
              label: '时间',
              time: 'time'
            }
          ],
          rules: [
            { required: true, trigger: 'change', message: '请选择' }
          ]
        }
      ],
      newDefaultData: []
    }
  },
  methods: {
    setDefaultData () {
      const ref =  this.$refs.actionEditTableRef
      const oldData = ref ? ref.getData() : []
      // 将已配置的数据和传入的defaultData进行合并
      this.newDefaultData = this.defaultData.map(item => {
        const oldItem = oldData.find(oldItem => oldItem.code === item.code && oldItem.name === item.name)
        return {
          ...item,
          display: true,
          showType: 'text',
          ...oldItem
        }
      })
    }
  }
}
</script>
