<template>
  <div>
    <el-select
      v-model="selectedItems"
      :value-key="props.value"
      multiple
      @focus="selectFocus"
      popper-class="department-popper"
    >
      <el-option
        v-for="item in selectedItems"
        :key="item[props.value]"
        :label="item[props.label]"
        :value="item"
      ></el-option>
    </el-select>

    <action-dialog
      v-model="dialogVisible"
      title="部门选择"
      @confirm="dialogConfirm"
      width="80%"
    >
      <action-form
        :span="24"
        :model="formModel"
        :formOptions="formOptions"
        labelPosition="top"
      ></action-form>
      <div class="tips" v-if="!formOptions.length">请在右侧配置面板中添加”分类”</div>
    </action-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'department-selector-2',
  props: {
    value: Array,
    __config__: Object,
    props: Object,
    options: Array
  },
  data () {
    return {
      selectedItems: this.value,
      dialogVisible: false,
      formModel: {},
      formOptions: [],
      requestResults: {}
    }
  },
  watch: {
    selectedItems: {
      handler (value) {
        this.$emit('input', value)
      },
      deep: true
    }
  },
  methods: {
    selectFocus (event) {
      this.$emit('focus', event)
      this.setFormModel()
      this.dialogVisible = true
    },
    setFormModel () {
      const ids = this.selectedItems.map(item => item[this.props.value]) // 默认值组成的id数组
      const obj = {}
      const arr = []
      const promises = []
      this.options.map(item => {
        obj[item.value] = ids || []
        arr.push({
          label: item.label,
          prop: item.value,
          type: 'checkbox',
          checkAll: true,
          options: [],
          optionsProps: {
            label: this.props.label,
            value: this.props.value
          }
        })
        // 根据value值发请求拿到对应的选项组
        promises.push(this.getOptions(item.value))
      })
      this.formModel = obj // 用部门分类的value值作为表单的属性名
      this.formOptions = arr // 生成表单所需配置
      Promise.all(promises).then(res => {
        res.map((options, i) => {
          this.formOptions[i].options = options
        })
      })
    },
    getOptions (type) {
      return new Promise((resolve, reject) => {
        const conf = this.__config__
        if (conf.dataType === 'dynamic') {
          const { method, url, dataPath } = this.__config__
          if (method && url) {
            if (this.requestResults[type]) {
              resolve(this.requestResults[type])
            } else {
              request({ method, url, params: { level: type } })
                .then((res) => {
                  if (!dataPath) {
                    console.error('dataPath值不存在')
                    return
                  }
                  // 根据dataPath获取到请求的指定位置的数据
                  const respData = dataPath.split('.').reduce((pre, item) => pre[item], res)
                  if (!respData) {
                    this.$message.error('数据位置有误')
                    return
                  }
                  const recursion = list => {
                    for (const item of list) {
                      item.label = item[this.props.label]
                      item.value = item[this.props.value]
                      const children = item[this.props.children]
                      if (children instanceof Array && children.length) {
                        if (this.props.children !== 'children') {
                          item.children = children
                        }
                        recursion(children)
                      }
                    }
                  }
                  recursion(respData)
                  resolve(respData)
                  this.requestResults[type] = respData // 将请求结果暂存
                })
                .catch((err) => {
                  this.$message.error(String(err))
                  console.error(err)
                  reject()
                })
            }
          } else {
            this.$message.error('请填写接口地址')
            reject()
          }
        } else {
          reject()
        }
      })
    },
    dialogConfirm () {
      this.dialogVisible = false
      const data = []
      // 查询复选框的value对应的label，转换成对象数组
      for (const key in this.formModel) {
        const options = this.formOptions.find(item => item.prop === key).options
        for (const val of this.formModel[key]) {
          const target = options.find(item => item[this.props.value] === val)
          if (target) {
            data.push({
              [this.props.value]: target[this.props.value],
              [this.props.label]: target[this.props.label]
            })
          }
        } 
      }
      this.selectedItems = data
    }
  },
}
</script>

<style>
.department-popper {
  display: none;
}
</style>
<style lang="scss" scoped>
  .tips {
    text-align: center;
    line-height: 130px;
    color: #b1b1b1;
  }
</style>