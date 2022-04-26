<template>
  <!-- 意见弹出 -->
  <action-dialog
    v-model="opinionDialogVisible"
    title="输入意见并处理结束"
    :loading="loading"
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
import { getProcessConfigInfo, getCandidate, startProcess, submitProcess } from '@/api/oa/process.js'
export default {
  data () {
    return {
      taskId: this.$route.query.taskId, // 任务id
      procInstId: undefined, // 流程实例id
      formData: null, // 表单数据
      loading: false,
      opinionDialogVisible: false,
      opinionForm: {
        suggestion: '',
        target: '',
        targetName: '',
        candidate: []
      },
      opinionFormOptions: [
        {
          label: '请输入您的意见',
          prop: 'suggestion',
          type: 'textarea',
          rules: [{ required: true, message: '请输入', trigger: 'change' }],
          showCondition: () => {
            return this.configObj.config.global.advice
          }
        },
        {
          label: '下一节点',
          prop: 'target',
          type: 'radio',
          options: [],
          rules: [{ required: true, message: '请选择', trigger: 'change' }],
          change: (value) => {
            this.getCandidate(value)
            this.opinionForm.candidate = []
            // 存储节点名称
            const index = this.opinionFormOptions.findIndex(item => item.prop === 'target')
            const options = this.opinionFormOptions[index].options
            this.opinionForm.targetName = options.find(item => item.value === value).label
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
          label: '处理人',
          prop: 'candidate',
          type: 'checkbox',
          options: [],
          optionsProps: {
            label: 'userName',
            value: 'userId'
          },
          checkAll: true
        },
        // {
        //   label: '附言',
        //   prop: 'prop3',
        //   type: 'textarea'
        // }
      ],
      opinionEntrustInfo: {}, // 委托代理信息
      configObj: {}, // 关于表单的一些配置
      isSubmitted: false // 判断该数据是否已经被提交了，每条业务数据只能被提交一次
    }
  },
  methods: {
    // 打开意见弹窗
    open (formData) {
      if (this.isSubmitted || (formData.procInstId !== undefined && formData.procInstId !== null)) {
        this.msgError('请勿重复提交')
        return
      }
      this.formData = formData
      this.getAppProcess()
      this.opinionDialogVisible = true
      this.$nextTick(() => {
        this.$refs.actionFormRef.reset()
      })
    },
    // 意见提交
    opinionDialogConfirm () {
      this.$refs.actionFormRef.getRef().validate(valid => {
        if (valid) {
          console.log('opinionForm', this.opinionForm);
          // 如果还未保存过就调用下保存接口
          if (this.$route.query.formDataId === undefined) {
            this.$emit('buttonEmitSave', () => {
              this.submit()
            })
          } else {
            this.submit()
          }
        }
      })
    },
    // 提交
    submit () {
      const { appId } = this.$route.query
      const index = this.opinionFormOptions.findIndex(item => item.prop === 'candidate')
      const candidateOptions = this.opinionFormOptions[index].options || []
      const data = {
        processDefinitionId: this.processDefinitionId, // 流程定义id
        current: this.taskDefKey, // 当前环节id
        dto: {
          id: this.$route.query.formDataId,  // 表单保存的id
          code: this.formData.code, // 表单字段为code的值
          title: this.formData.title, // 表单字段为title的值
          moduleId: appId, // 应用id
        },
        source: 0, // 用户采用什么提交数据：0 pc、1 手机、2 其他
        sendSMS: this.configObj.config.global.sendPhoneMessage, // 手机短信发送标示: false 不发送短信、true 推送短信
        suggestion: this.opinionForm.suggestion ,//处理意见  
        processNodeDTO: [ // 环节
          {
            target: this.opinionForm.target,
            flowName: this.opinionForm.targetName,
            candidate: candidateOptions.filter(item => {
              return this.opinionForm.candidate.includes(item.userId)
            })
          }
        ],
        orgId: 0, // 部门id
      }
      this.loading = true
      if (this.taskId) {
        // 从候选人列表里筛选出当前登录人
        // 获取当前登录人username
        const username = this.$store.state.user.userInfo.username
        const user = this.checkUserList.find(item => item.userId === username)
        const userAttrs = ['userId', 'userName', 'principal', 'orgId', 'orgName', 'roleId', 'roleName']
        const newUser = {}
        if (user) {
          for (let key in user) {
            if (userAttrs.includes(key)) {
              newUser[key] = user[key]
            }
          }
        } else {
          console.error(`没有在checkUserList中找到username为${username}的用户`)
        }
        Object.assign(data, {
          taskId: this.taskId,
          procInstId: this.procInstId,
          ...newUser
        })
        submitProcess(data).then(() => {
          this.msgSuccess('提交成功')
          this.opinionDialogVisible = false
          this.loading = false
          this.saveAgain(res.data)
        }).catch(() => {
          this.loading = false
        })
      } else {
        console.log("🚀 ~ file: opinion.vue ~ line 120 ~ this.$refs.actionFormRef.getRef ~ data", data)
        startProcess(data).then(res => {
          this.msgSuccess('提交成功')
          this.opinionDialogVisible = false
          this.loading = false
          this.saveAgain(res.data)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 意见提交之后拿到流程实例id，要再调用一次保存接口，修改流程实例id字段值
    saveAgain (procInstId) {
      this.$emit('buttonEmitSave', () => {
        this.isSubmitted = true
      }, { procInstId })
    },
    // 获取app的流程定义id
    getAppProcess () {
      const { pageModelCode } = this.$route.query
      const resData = this.$store.state.codeEditor.process.processConfig
      // 从地址栏判断是否有任务id
      if (this.taskId) {
        const task = resData.task
        if (task) {
          this.processDefinitionId = task.config.processDefId // 流程定义id
          this.taskDefKey = task.config.taskDefKey  // 流程审批环节id
          this.procInstId = task.procInstId // 流程实例id
          this.configObj = task.config
          this.checkUserList = task.checkUserList // 任务处理的候选人列表
          this.getProcessConfigInfo(this.taskDefKey)
        } else {
          return Promise.reject(`表单未绑定流程(Code:${pageModelCode})`)
        }
      } else {
        // 如果没有任务id就从process对象里取值
        const process = resData.process
        if (process) {
          this.processDefinitionId = process.dto.id // 流程定义id
          this.taskDefKey = process.view.dto.id  // 流程审批环节id
          this.configObj = process.view.config
          this.getProcessConfigInfo(this.taskDefKey)
        } else {
          return Promise.reject(`表单未绑定流程(Code:${pageModelCode})`)
        }
      }
    },
    // 获取 下一节点 选项
    getProcessConfigInfo (taskDefKey) {
      getProcessConfigInfo({
        processDefinitionId: this.processDefinitionId,
        taskDefKey
      }).then(res => {
        const index = this.opinionFormOptions.findIndex(item => item.prop === 'target')
        this.opinionFormOptions[index].options = res.data.map(item => ({
          label: item.name,
          value: item.node.id
        }))
      })
    },
    // 获取送审稿人员列表
    getCandidate (taskDefKey) {
      getCandidate(this.processDefinitionId, taskDefKey, this.procInstId).then(res => {
        const index = this.opinionFormOptions.findIndex(item => item.prop === 'candidate')
        this.opinionFormOptions[index].options = res.data
      })
    }
  }
}
</script>
