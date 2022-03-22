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
import { getProcessConfigInfo, getAppProcess, getCandidate, startProcess, submitProcess } from '@/api/oa/process.js'
export default {
  data () {
    return {
      taskId: this.$route.query.taskId, // 任务id
      procInstId: undefined, // 流程实例id
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
          label: '送核稿',
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
      configObj: {} // 关于表单的一些配置
    }
  },
  methods: {
    // 打开意见弹窗
    open () {
      this.getAppProcess(this.$route.query.appId, this.taskId).then(() => {
        this.opinionDialogVisible = true
        this.$nextTick(() => {
          this.$refs.actionFormRef.reset()
        })
      }).catch(err => {
        this.msgError(err)
      })
    },
    // 意见提交
    opinionDialogConfirm () {
      this.$refs.actionFormRef.getRef().validate(valid => {
        if (valid) {
          console.log('opinionForm', this.opinionForm);
          // 先调用保存接口获取数据id
          this.loading = true
          this.$emit('buttonEmitSave', res => {
            const dataId = res.data.id
            const { pageModelCode, appId } = this.$route.query
            const index = this.opinionFormOptions.findIndex(item => item.prop === 'candidate')
            const candidateOptions = this.opinionFormOptions[index].options || []
            const data = {
              processDefinitionId: this.processDefinitionId, // 流程定义id
              current: this.taskDefKey, // 当前环节id
              dto: {
                id: dataId,  // 表单保存的id
                code: pageModelCode, // 表单 编号字段
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
              }).catch(() => {
                this.loading = false
              })
            } else {
              console.log("🚀 ~ file: opinion.vue ~ line 120 ~ this.$refs.actionFormRef.getRef ~ data", data)
              startProcess(data).then(() => {
                this.msgSuccess('提交成功')
                this.opinionDialogVisible = false
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            }
          })
        }
      })
    },
    // 获取app的流程定义id
    getAppProcess (appId, taskId) {
      return getAppProcess(appId, taskId).then(res => {
        // 从地址栏判断是否有任务id
        if (this.taskId) {
          const task = res.data.task
          if (task) {
            this.processDefinitionId = task.config.processDefId // 流程定义id
            this.taskDefKey = task.config.taskDefKey  // 流程审批环节id
            this.procInstId = task.procInstId // 流程实例id
            this.configObj = task.config
            this.checkUserList = task.checkUserList // 任务处理的候选人列表
            this.getProcessConfigInfo(this.taskDefKey)
          } else {
            return Promise.reject(`app(ID:${appId})无流程数据`)
          }
        } else {
          // 如果没有任务id就从process对象里取值
          const process = res.data.process
          if (process) {
            this.processDefinitionId = process.dto.id // 流程定义id
            this.taskDefKey = process.view.dto.id  // 流程审批环节id
            this.configObj = process.view.config
            this.getProcessConfigInfo(this.taskDefKey)
          } else {
            return Promise.reject(`app(ID:${appId})无流程数据`)
          }
        }
      })
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
