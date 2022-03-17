<template>
  <!-- 意见弹出 -->
  <action-dialog
    v-model="opinionDialogVisible"
    title="输入意见并处理结束"
    @confirm="opinionDialogConfirm"
  >
    <action-form
      ref="actionFormRef"
      :model="opinionForm"
      :formOptions="opinionFormOptions"
      :span="24"
      label-position="top"
    >
      <!-- <template slot="weituo">
          <el-select v-model="opinionForm.prop4">
          <el-option label="是" value="yes"></el-option>
          <el-option label="否" value="no"></el-option>
        </el-select>
        <span>{{` （小明从2022-01-13到2022委托代理，选“是”发给代理人小红，选“否”发给小明）`}}</span>
      </template> -->
    </action-form>
  </action-dialog>
</template>

<script>
import { getProcessConfigInfo, getAppProcess, getCandidate } from '@/api/oa/process.js'
export default {
  data () {
    return {
      opinionDialogVisible: false,
      opinionForm: {
        prop1: '',
        prop2: '',
        prop3: '',
        prop4: '',
        prop6: []
      },
      opinionFormOptions: [
        {
          label: '请输入您的意见',
          prop: 'prop1',
          type: 'textarea',
          rules: [{ required: true, message: '请输入', trigger: 'change' }]
        },
        {
          label: '下一节点',
          prop: 'prop2',
          type: 'radio',
          options: [],
          rules: [{ required: true, message: '请选择', trigger: 'change' }],
          change: (value) => {
            this.getCandidate(value)
          }
        },
        // {
        //   label: '委托代理',
        //   prop: 'prop4',
        //   type: 'slot',
        //   slotName: 'weituo',
        //   rules: [{ required: true, message: '请选择', trigger: 'change' }],
        //   showCondition (model) {
        //     return model.prop2 === '1'
        //   }
        // },
        {
          label: '送核稿',
          prop: 'prop6',
          type: 'checkbox',
          options: [],
          optionsProps: {
            label: 'userName',
            value: 'userId'
          },
          checkAll: true
        },
        {
          label: '附言',
          prop: 'prop3',
          type: 'textarea'
        }
      ],
      opinionEntrustInfo: {} // 委托代理信息
    }
  },
  methods: {
    // 打开意见弹窗
    open () {
      this.getAppProcess(this.$route.query.appId).then(() => {
        this.opinionDialogVisible = true
      }).catch(err => {
        this.msgError(err)
      })
    },
    // 意见提交
    opinionDialogConfirm () {
      this.$refs.actionFormRef.getRef().validate(valid => {
        if (valid) {
          console.log('opinionForm', this.opinionForm);
        }
      })
    },
    // 获取app的流程定义id
    getAppProcess (appId) {
      return getAppProcess(appId).then(res => {
      const process = res.data.process
        if (process) {
          this.processDefinitionId = process.dto.id
          this.getProcessConfigInfo(process.view.dto.id)
        } else {
          return Promise.reject(`app(ID:${appId})无流程数据`)
        }
      })
    },
    // 获取 下一节点 选项
    getProcessConfigInfo (taskDefKey) {
      getProcessConfigInfo({
        processDefinitionId: this.processDefinitionId,
        taskDefKey
      }).then(res => {
        const index = this.opinionFormOptions.findIndex(item => item.prop === 'prop2')
        this.opinionFormOptions[index].options = res.data.map(item => ({
          label: item.name,
          value: item.node.id
        }))
      })
    },
    // 获取送审稿人员列表
    getCandidate (taskDefKey) {
      getCandidate(this.processDefinitionId, taskDefKey).then(res => {
        const index = this.opinionFormOptions.findIndex(item => item.prop === 'prop6')
        this.opinionFormOptions[index].options = res.data
      })
    }
  }
}
</script>
