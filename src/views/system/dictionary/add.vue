<template>
  <div>
    <action-form
      :model="form"
      :formOptions="formOptions"
      :span="8"
      label-width="70px"
      ref="actionFormRef"
    ></action-form>
    <div class="mb8">
      <action-button actionType="1" @click="handleAdd">新增</action-button>
      <action-button actionType="2" @click="handleDel">删除</action-button>
    </div>
    <action-edit-table
      ref="actionEditTableRef"
      showSelection
      :tableColumns="tableColumns"
      :defaultData="form.data"
    ></action-edit-table>
  </div>
</template>

<script>
const getDefaultForm = () => {
  return {
    name: '', // 表名称
    code: '', // 表描述
    description: '', // 数据源
    data: [] // 字段定义
  }
}
export default {
  data () {
    return {
      form: getDefaultForm(),
      formOptions: [
        {
          label: '名称',
          prop: 'name',
          disabled: false,
          rules: [
            { required: true, message: "请输入名称", trigger: "change" }
          ]
        },
        {
          label: '标识',
          prop: 'code',
          disabled: false,
          rules: [
            { required: true, message: "请输入标识", trigger: "change" }
          ]
        },
        {
          label: '描述',
          prop: 'description'
        }
      ],
      tableColumns: [
        {
          label: '标签',
          prop: 'label',
          rules: [
            { required: true, trigger: 'change', message: '请输入'}
          ]
        },
        {
          label: '值',
          prop: 'value',
          rules: [
            { required: true, trigger: 'change', message: '请输入'}
          ]
        },
        {
          label: '是否默认',
          prop: 'isDefault',
          type: 'switch',
          activeValue: 'yes',
          inactiveValue: 'no'
        },
        {
          label: '排序',
          prop: 'sort',
          type: 'inputNumber',
          min: 0,
          defaultValue: 1
        }
      ],
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1
    },
    handleAdd () {
      this.$refs.actionEditTableRef.addRow()
    },
    handleDel () {
      this.$refs.actionEditTableRef.deleteRow()
    },
    submit () {
      const p1 = new Promise((resolve, reject) => {
        const form1 = this.$refs.actionFormRef.getRef()
        form1.validate(valid => {
          if (valid) resolve(this.form)
        })
      })
      const p2 = new Promise((resolve, reject) => {
        const ref = this.$refs.actionEditTableRef
        ref.getRef().validate(valid => {
          if (valid) resolve(ref.getData())
        })
      })
      return Promise.all([p1, p2])
    },
    reset () {
      this.$refs.actionFormRef.reset()
      this.form = getDefaultForm()
    }
  }
}
</script>
