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
      :formOptions="OpinionFormOptions"
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
import { getProcessConfigInfo, getAppProcess } from '@/api/oa/process.js'
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
      OpinionFormOptions: [
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
          options: [
            {
              label: '送审核',
              value: '1'
            },
            {
              label: '退回',
              value: '2'
            }
          ],
          rules: [{ required: true, message: '请选择', trigger: 'change' }],
          change (value) {
            console.log("🚀 ~ file: opinion.vue ~ line 62 ~ change ~ value", value)
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
          options: [
            {
              label: '小明',
              value: '1'
            },
            {
              label: '大壮',
              value: '2'
            }
          ],
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
    open () {
      this.getAppProcess(this.$route.query.appId).then(() => {
        this.opinionDialogVisible = true
      }).catch(err => {
        this.msgError(err)
      })
    },
    opinionDialogConfirm () {
      this.$refs.actionFormRef.getRef().validate(valid => {
        if (valid) {
          console.log('opinionForm', this.opinionForm);
        }
      })
    },
    getAppProcess (appId) {
      return getAppProcess(appId).then(res => {
      const process = res.data.process
        if (process) {
          this.getProcessConfigInfo(process.dto.id, process.view.dto.id)
        } else {
          return Promise.reject(`app(ID:${appId})无流程数据`)
        }
      })
    },
    getProcessConfigInfo (processDefinitionId, taskDefKey) {
      getProcessConfigInfo({
        processDefinitionId,
        taskDefKey
      }).then(res => {
        console.log("🚀 ~ file: opinion.vue ~ line 117 ~ getProcessConfigInfo ~ res", res)
      })
    }
  }
}
</script>
