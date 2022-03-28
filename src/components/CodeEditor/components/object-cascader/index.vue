<template>
  <el-cascader
    ref="elCascaderRef"
    v-model="newValue"
    :props="props"
    v-bind="$attrs"
    :options="newOptions"
    @change="handleChange"
  ></el-cascader>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      newOptions: [],
      newValue: null
    }
  },
  props: {
    __config__: Object,
    value: Array,
    props: Object,
    options: Array
  },
  async mounted () {
    await this.getOptions()
    this.setNewValue()
    setTimeout(() => {
      this.handleChange()
    }, 300)
  },
  methods: {
    setNewValue () {
      this.newValue = JSON.parse(JSON.stringify(this.value || null))
    },
    async getOptions () {
      this.newValue = null
      const conf = this.__config__
      if (conf.dataType === 'dynamic') {
        const { method, url, dataPath } = this.__config__
        if (method && url) {
          await axios({ method, url })
            .then((res) => {
              const resp = res.data
              if (!dataPath) {
                console.error('dataPath值不存在')
                return
              }
              // 根据dataPath获取到请求的指定位置的数据
              const respData = dataPath.split('.').reduce((pre, item) => pre[item], resp)
              if (!respData) {
                this.$message.error('数据位置有误')
                return
              }
              const recursion = list => {
                for (const item of list) {
                  item.label = item[this.props.label]
                  item.value = item[this.props.value]
                  const children = item[this.props.children]
                  if (children instanceof Array) {
                    if (this.props.children !== 'children') {
                      item.children = children
                    }
                    recursion(children)
                  }
                }
              }
              recursion(respData)
              this.newOptions = respData
            })
            .catch((err) => {
              this.$message.error(String(err))
              console.error(err)
            })
        } else {
          this.$message.error('请填写接口地址')
        }
      } else {
        this.newOptions = JSON.parse(JSON.stringify(this.options))
      }
    },
    handleChange () {
      const nodes = this.$refs.elCascaderRef.getCheckedNodes(!this.props.checkStrictly)
      const labels = []
      nodes.map((item) => {
        item && labels.push(item.pathLabels.join('/'))
      })
      this.$emit('change', labels)
      this.$emit('input', this.newValue)
    }
  }
}
</script>
