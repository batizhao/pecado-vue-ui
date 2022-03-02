<template>
  <div>
    <el-tabs v-model="activeName">
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
        <list-show></list-show>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import listShow from './listShow/index.vue'
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
    listShow
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
          type: 'inputNumber'
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
      ]
    }
  },
  methods: {
    submit () {
      let data = null
      const form = this.$refs.actionFormRef.getRef()
      form.validate(valid => {
        if (valid) {
          data = {
            basicForm: this.form
          }
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