
<template>
  <div>
    <action-edit-table
      ref="actionEditTableRef"
      :defaultData="columnMetadata"
      :tableColumns="tableColumns"
    >
      <template v-slot:type="scope">
        {{getTypeLabel(scope.row.type)}}
      </template>
    </action-edit-table>
    <br/>
  </div>
</template>

<script>
export default {
  props: {
    columnMetadata: Array
  },
  data () {
    return {
      typeOptions: [],
      tableColumns: [
        {
          label: '字段名称',
          prop: 'name',
          readonly: true
        },
        {
          label: '字段描述',
          prop: 'comment',
          readonly: true
        },
        {
          label: '字段类型',
          prop: 'type',
          type: 'slot',
          slotName: 'type'
        },
        {
          label: 'Java类型',
          prop: 'javaType',
          type: 'select',
          options: [
            { value: 'Long' },
            { value: 'String' },
            { value: 'Integer' },
            { value: 'Double' },
            { value: 'BigDecimal' },
            { value: 'Date' },
            { value: 'LocalDateTime' },
          ],
          optionsProps: {
            label: 'value',
            value: 'value'
          },
          rules: [
            { required: true, trigger: 'change', message: '请选择' }
          ]
        },
        {
          label: 'Java属性',
          prop: 'javaField',
          rules: [
            { required: true, trigger: 'change', message: '请输入' }
          ]
        },
        {
          label: '插入',
          prop: 'save',
          type: 'checkbox',
          rules: [
            { required: true }
          ]
        },
        {
          label: '必填',
          prop: 'required',
          type: 'checkbox',
          rules: [
            { required: true }
          ]
        },
        {
          label: '显示类型',
          prop: 'htmlType',
          type: 'select',
          options: [
            { value: 'input', label: '单行文本' },
            { value: 'textarea', label: '多行文本' },
            { value: 'select', label: '下拉选择框' },
            { value: 'radio', label: '单选框' },
            { value: 'checkbox', label: '多选框' },
            { value: 'switch', label: '开关' },
            { value: 'datetime', label: '日期选择器' },
            { value: 'imageUpload', label: '图片' },
            { value: 'fileUpload', label: '文件' },
            { value: 'editor', label: '编辑器' },
          ],
          rules: [
            { required: true, trigger: 'change', message: '请选择' }
          ]
        }
      ]
    }
  },
  created () {
    this.listDictDataByCode('db_column_type').then(res => {
      this.typeOptions = res.data
    })
  },
  methods: {
    getTypeLabel (val) {
      const item = this.typeOptions.find(item => item.value === val)
      return item ? item.label : val
    }
  }
}
</script>

<style scoped>
.red-star::before {
  content: '* ';
  color: red;
}
</style>