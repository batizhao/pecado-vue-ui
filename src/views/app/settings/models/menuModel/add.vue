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
    scope: 'dashboard'
  }
}
export default {
  data () {
    return {
      form: getDefaultFrom(),
      formOptions: [
        {
          label: '上级菜单',
          prop: 'pid'
        },
        {
          label: '菜单类型',
          prop: 'type',
          type: 'radio',
          options: [
            { value: 'M', label: '菜单' },
            { value: 'B', label: '按钮' }
          ],
          defaultValue: 'M'
        },
        {
          label: '菜单图标',
          prop: 'icon',
          type: 'input',
        },
        {
          label: '菜单名称',
          prop: 'name',
          type: 'input',
          rules: [
            { required: true, message: "菜单名称不能为空", trigger: "change" },
          ]
        },
        {
          label: '显示排序',
          prop: 'sort',
          type: 'inputNumber',
          rules: [
            { required: true, message: "显示顺序不能为空", trigger: "change" },
          ]
        },
        {
          label: '路由地址',
          prop: 'path',
          type: 'input',
          rules: [
            { required: true, message: "路由地址不能为空", trigger: "change" },
          ]
        },
        {
          label: '权限标识',
          prop: 'permission',
          type: 'input',
        },
        {
          label: '菜单说明',
          prop: 'description',
          type: 'input',
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