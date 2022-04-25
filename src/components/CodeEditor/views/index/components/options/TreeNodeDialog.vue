<template>
  <div>
    <el-dialog
      title="添加选项"
      :close-on-click-modal="false"
      append-to-body
      @open="onOpen"
      @close="onClose"
      :visible.sync="visible"
      width="500px"
    >
      <el-form ref="elForm" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="选项名" :prop="treeProps.label">
          <el-input v-model="formData[treeProps.label]" placeholder="请输入选项名" clearable />
        </el-form-item>
        <el-form-item label="值" :prop="treeProps.value">
          <el-input v-model="formData[treeProps.value]" placeholder="请输入值" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handelConfirm">
          确定
        </el-button>
        <el-button @click="onClose">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    visible: Boolean,
    options: Array,
    treeProps: Object
  },
  data () {
    return {
      formData: {
        id: '',
        label: '',
        value: ''
      },
      rules: {
        label: [{ required: true, message: '请输入选项名', trigger: 'blur' }],
        value: [{ required: true, message: '请输入值', trigger: 'blur' }]
      }
    }
  },
  methods: {
    onOpen () {
      const value = new Date().getTime() - 1642575442290
      this.formData = {
        id: value,
        [this.treeProps.label]: '',
        [this.treeProps.value]: String(value)
      }
    },
    onClose () {
      this.$emit('update:visible', false)
    },
    handelConfirm () {
      this.$refs.elForm.validate((valid) => {
        if (!valid) return
        this.$emit('commit', this.formData)
        this.onClose()
      })
    }
  }
}
</script>
