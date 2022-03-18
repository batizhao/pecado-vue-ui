<template>
  <div>
    <action-form
      :model="form"
      :formOptions="formOptions"
      label-width="100px"
      ref="actionFormRef"
      :span="24"
    ></action-form>
  </div>
</template>
<script>
const getDefaultFrom = () => {
  return {
    name: '',
    formKey: '', 
    description: ''
  }
}
export default {
  data () {
    return {
      form: getDefaultFrom(),
      formOptions: [
        {
          label: '表单名称',
          prop: 'name',
          rules: [
            { required: true, message: "请输入表单名称", trigger: "change" },
          ]
        },
        {
          label: '表单描述',
          prop: 'description',
          type: 'textarea',
        },
        {
          label: '保存接口地址',
          prop: 'submitURL'
        }
      ]
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