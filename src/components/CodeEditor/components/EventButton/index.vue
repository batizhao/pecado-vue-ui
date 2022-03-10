<template>
  <div>
    <el-button v-bind="$attrs" @click.prevent="click">
      <slot></slot>
    </el-button>

    <!-- 意见弹出 -->
    <action-dialog
      v-model="opinionDialogVisible"
      title="输入意见并处理结束"
      @confirm="opinionDialogConfirm"
    >
      <el-form
        ref="opinionFormRef"
        label-position="top"
        :model="opinionForm"
        :rules="opinionRules"
      >
        <el-form-item label="请输入您的意见" prop="prop1">
          <el-input type="textarea" :rows="3" v-model="opinionForm.prop1"></el-input>
        </el-form-item>
        <el-form-item label="下一节点" prop="prop2">
          <el-radio v-model="opinionForm.prop2" label="1">送审核</el-radio>
          <el-radio v-model="opinionForm.prop2" label="2">退回</el-radio>
        </el-form-item>
        <el-form-item label="委托代理" prop="prop4" v-if="opinionForm.prop2 === '1'">
          <el-select v-model="opinionForm.prop4">
            <el-option label="是" value="yes"></el-option>
            <el-option label="否" value="no"></el-option>
          </el-select>
          <span>{{` （小明从2022-01-13到2022委托代理，选“是”发给代理人小红，选“否”发给小明）`}}</span>
        </el-form-item>
        <el-form-item label="附言" prop="prop3">
          <el-input type="textarea" :rows="3" v-model="opinionForm.prop3"></el-input>
        </el-form-item>
      </el-form>
    </action-dialog>
  </div>
</template>

<script>
export default {
  name: 'event-button',
  props: {
    eventSettings: Object
  },
  data () {
    return {
      opinionDialogVisible: false,
      opinionForm: {
        prop1: '',
        prop2: '',
        prop3: '',
        prop4: ''
      },
      opinionRules: {
        prop1: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        prop2: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        prop4: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      opinionEntrustInfo: {} // 委托代理信息
    }
  },
  methods: {
    click () {
      const emit = this.eventSettings.emit
      if (!emit) return
      // 通过回调获取表单容器的ref节点
      this.$emit('nativeClick', formContainerRef => {
        this[emit](formContainerRef)
      })
    },
    buttonEmitSubmit (formContainerRef) {
      formContainerRef.submit().then(formData => {
        console.log("🚀 ~ file: index.vue ~ line 32 ~ buttonEmitSubmit ~ formData", formData)
      })
      this.opinionDialogVisible = true // 打开意见弹窗
    },
    opinionDialogConfirm () {
      this.$refs.opinionFormRef.validate(valid => {
        if (valid) {

        }
      })
    },
    buttonEmitSave (formContainerRef) {
      formContainerRef.submit().then(formData => {
        console.log("🚀 ~ file: index.vue ~ line 32 ~ buttonEmitSubmit ~ formData", formData)
      })
    }
  }
}
</script>
