<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="1">
        <action-form
          :model="form"
          :formOptions="formOptions"
          label-width="170px"
          ref="actionFormRef"
          :span="8"
        ></action-form>
      </el-tab-pane>
      <el-tab-pane label="列表显示" name="2">
        <list-show ref="listShowRef"></list-show>
      </el-tab-pane>
      <el-tab-pane label="查询条件" name="3">
        <query-condition ref="queryConditionRef" :defaultData="queryConditionDefaultValue"></query-condition>
      </el-tab-pane>
      <el-tab-pane label="按钮配置" name="4">
        <buttons-setting ref="buttonSettingRef"></buttons-setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import listShow from './listShow/index.vue'
import buttonsSetting from './buttonsSetting/index.vue'
import queryCondition from './queryCondition/index.vue'

const getDefaultFrom = () => {
  return {
    name: '', 
    code: '',
    addr: '',
    lineNum: 1,
    page: 1,
    pageSize: 10,
    operField: 1,
    fixedOperField: 0,
    operFieldWidth: 120,
    sideScroll: 1,
    beforeEvent: '',
    afterEvent: ''
  }
}
const yesOrNot = [
  {
    label: '是',
    value: 1
  },
  {
    label: '否',
    value: 0
  }
]
export default {
  components: {
    listShow,
    buttonsSetting,
    queryCondition
  },
  data () {
    return {
      activeName: '1',
      form: getDefaultFrom(),
      formOptions: [
        {
          label: '页面名称',
          prop: 'name',
          rules: [
            { required: true, message: "请输入页面名称", trigger: "change" },
          ]
        },
        {
          label: '页面编码',
          prop: 'code',
          rules: [
            { required: true, message: "请输入页面编码", trigger: "change" },
          ]
        },
        {
          label: '数据列表接口请求地址',
          prop: 'addr',
          rules: [
            { required: true, message: "请输入请求地址", trigger: "change" },
          ]
        },
        {
          label: '行号',
          prop: 'lineNum',
          type: 'radio',
          options: yesOrNot
        },
        {
          label: '分页',
          prop: 'page',
          type: 'radio',
          options: yesOrNot
        },
        {
          label: '分页大小',
          prop: 'pageSize',
          type: 'select',
          options: [
            { label: 10, value: 10 },
            { label: 20, value: 20 },
            { label: 50, value: 50 },
            { label: 100, value: 100 },
            { label: 200, value: 200 },
            { label: 500, value: 500 },
          ],
          rules: [
            { required: true, message: "请选择分页大小", trigger: "change" },
          ]
        },
        {
          label: '操作列',
          prop: 'operField',
          type: 'radio',
          options: yesOrNot
        },
        {
          label: '操作列固定',
          prop: 'fixedOperField',
          type: 'radio',
          options: yesOrNot
        },
        {
          label: '操作列宽度',
          prop: 'operFieldWidth',
          type: 'inputNumber',
          rules: [
            { required: true, message: "请输入操作列宽度", trigger: "change" },
          ]
        },
        {
          label: '横向滚动',
          prop: 'sideScroll',
          type: 'radio',
          options: yesOrNot
        },
        {
          label: '加载前事件',
          prop: 'beforeEvent',
          type: 'textarea',
          span: 24
        },
        {
          label: '加载后事件',
          prop: 'afterEvent',
          type: 'textarea',
          span: 24
        }
      ],
      queryConditionDefaultValue: []
    }
  },
  methods: {
    submit () {
      const forms = [
        {
          label: '基本信息',
          activeName: '1',
          ref: this.$refs.actionFormRef.getRef(),
          value: this.form
        },
        {
          label: '列表显示',
          activeName: '2',
          ref: this.$refs.listShowRef.$refs.actionEditTableRef.getRef(),
          value: this.$refs.listShowRef.$refs.actionEditTableRef.getData()
        },
        {
          label: '按钮配置',
          activeName: '3',
          ref: this.$refs.buttonSettingRef.$refs.actionEditTableRef.getRef(),
          value: this.$refs.buttonSettingRef.$refs.actionEditTableRef.getData()
        },
        {
          label: '查询条件',
          activeName: '4',
          ref: this.$refs.queryConditionRef.$refs.actionEditTableRef.getRef(),
          value: this.$refs.queryConditionRef.$refs.actionEditTableRef.getData()
        }
      ]
      const proxyArr = forms.map(form => {
        return new Promise((resolve, reiect) => {
          form.ref.validate(valid => {
            if (valid) {
              resolve(form.value)
            } else {
              reiect(form.label + ' 校验不通过')
              // 跳转到指定的tab页
              this.activeName = form.activeName
            }
          })
        })
      })
      return new Promise((resolve, reject) => {
        Promise.all(proxyArr).then(res => {
          // 将数据合并到第一个元素的对象中
          const obj = res[0]
          obj.header = res[1]
          obj.condition = res[2]
          obj.button = res[3]
          resolve(obj)
        }).catch(err => {
          this.msgError(err)
          reject(err)
        })
      })
    },
    reset () {
      this.$refs.actionFormRef.reset()
      this.form = getDefaultFrom()
    },
    handleTabClick () {
      // 切换到查询条件时，要将列表显示中的数据拿过来
      if (this.activeName === '3') {
        const data = this.$refs.listShowRef.$refs.actionEditTableRef.getData()
        this.queryConditionDefaultValue = data.map(item => {
          return {
            code: item.code,
            name: item.name
          }
        })
      }
    }
  }
}
</script>