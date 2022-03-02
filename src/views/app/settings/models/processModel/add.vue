<template>
  <div>
    <action-form
      :model="form"
      :formOptions="formOptions"
      label-width="120px"
      ref="actionFormRef"
      :span="24"
    ></action-form>
  </div>
</template>
<script>
const getDefaultFrom = () => {
  return {
    processKey: '',
    name: '', 
    version: ''
  }
}
export default {
  data () {
    return {
      form: getDefaultFrom(),
      formOptions: [
        {
          label: '流程定义Key',
          prop: 'processKey',
          rules: [
            { required: true, message: "请输入流程定义Key", trigger: "change" },
          ]
        },
        {
          label: '流程名称',
          prop: 'name',
          rules: [
            { required: true, message: "请输入流程名称", trigger: "change" },
          ]
        },
        {
          label: '版本',
          prop: 'version',
          type: 'inputNumber',
          rules: [
            { required: true, message: "请输入版本", trigger: "change" },
          ]
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