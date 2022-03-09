<template>
  <div>
    <div class="mb8">
      <action-button actionType="1" @click="handleAdd">新增</action-button>
      <action-button actionType="2" @click="handleDel">删除</action-button>
    </div>
    <action-edit-table
      ref="actionEditTableRef"
      :defaultData="[]"
      :tableColumns="tableColumns"
      showSelection
    ></action-edit-table>
  </div>
</template>

<script>
export default{
  data () {
    return {
      tableColumns: [
        {
          label: '列标识',
          prop: 'code',
          rules: [
            { required: true, trigger: 'change', message: '请输入' }
          ]
        },
        {
          label: '列名称',
          prop: 'name',
          rules: [
            { required: true, trigger: 'change', message: '请输入' }
          ]
        },
        {
          label: '列类型',
          prop: 'type',
          type: 'select',
          options: [],
          rules: [
            { required: true, trigger: 'change', message: '请选择' }
          ],
          defaultValue: 'varchar'
        },
        {
          label: '对齐方式',
          prop: 'alignType',
          type: 'select',
          rules: [
            { required: true, trigger: 'change', message: '请选择' }
          ],
          options: [
            {
              value: 'left',
              label: '居左'
            },
            {
              value: 'center',
              label: '居中'
            },
            {
              value: 'right',
              label: '居右'
            }
          ],
          defaultValue: 'center'
        },
        {
          label: '列宽度',
          prop: 'width',
          type: 'inputNumber',
          min: 0,
          defaultValue: 200
        },
        {
          label: '显示',
          prop: 'display',
          type: 'checkbox',
          defaultValue: true
        },
        // {
        //   label: '可导出',
        //   prop: 'wrew',
        //   type: 'checkbox',
        //   defaultValue: true
        // },
        // {
        //   label: '可导入',
        //   prop: 'wrew',
        //   type: 'checkbox',
        //   defaultValue: true
        // },
        {
          label: '固定列',
          prop: 'fixed',
          type: 'select',
          rules: [
            { required: true, trigger: 'change', message: '请选择' }
          ],
          options: [
            {
              label: '不固定',
              value: false
            },
            {
              label: '固定左侧',
              value: 'left'
            },
            {
              label: '固定右侧',
              value: 'right'
            }
          ],
          defaultValue: false
          
        },
        // {
        //   label: '超宽省略',
        //   prop: 'te',
        //   type: 'checkbox'
        // }
      ],
    }
  },
  created () {
    this.listDictDataByCode('db_column_type').then(res => {
      const index = this.tableColumns.findIndex(item => item.prop === 'type')
      this.tableColumns[index].options = res.data
    })
  },
  methods: {
    handleAdd () {
      this.$refs.actionEditTableRef.addRow()
    },
    handleDel () {
      this.$refs.actionEditTableRef.deleteRow()
    },
    submit () {
      
    },
    reset () {
      
    }
  }
}
</script>
