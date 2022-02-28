<template>
  <div>
    <action-form
      :model="form"
      :formOptions="formOptions"
      label-width="100px"
      ref="actionFormRef"
    ></action-form>
  </div>
</template>
<script>
const getDefaultFrom = () => {
  return {
    name: '',
    code: '', 
    type: 'form',
    modelEvent: '',
    beforeEvent: '',
    afterEvent: '',
    remark: '',
    pageMetadata: '{}'
  }
}
export default {
  props: {
    moduleTypeOptions: Array
  },
  data () {
    return {
      form: getDefaultFrom(),
      formOptions: [
        {
          label: '模板名称',
          prop: 'name',
          rules: [
            { required: true, message: '请输入模板名称', trigger: 'blur' },
          ]
        },
        {
          label: '模板标识',
          prop: 'code',
          rules: [
            { required: true, message: '请输入模板标识', trigger: 'blur' }
          ]
        },
        {
          label: '模板类型',
          prop: 'type',
          type: 'select',
          options: this.moduleTypeOptions,
          rules: [
            { required: true, message: '请选择模板类型', trigger: 'change'}
          ]
        },
        {
          label: '页面事件',
          prop: 'modelEvent',
          span: 24,
          type: 'textarea'
        },
        {
          label: '前置事件',
          prop: 'beforeEvent',
          span: 24,
          type: 'textarea'
        },
        {
          label: '后置事件',
          prop: 'afterEvent',
          span: 24,
          type: 'textarea'
        },
        {
          label: '备注',
          prop: 'remark',
          span: 24,
          type: 'textarea'
        },
      ],
    }
  },
  methods: {
    submit () {
      let data = null
      const form = this.$refs.actionFormRef.getRef()
      form.validate(valid => {
        if (valid) {
          data = this.form
        }
      })
      return data
    },
    reset () {
      this.$refs.actionFormRef.reset()
      this.form = getDefaultFrom()
    }
  }
}
</script>