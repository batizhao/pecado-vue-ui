<template>
  <div>
    <el-select
      v-model="newValue"
      v-bind="$attrs"
      :multiple="multiple"
      :value-key="valueKey"
      @change="selectorChange"
      >
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    value: [String, Array, Number],
    multiple: Boolean,
    __config__: Object,
    __slot__: Object,
    props: Object
  },
  data () {
    return {
      newValue: null,
      options: []
    }
  },
  computed: {
    valueKey () {
      return this.__config__.dataType === 'dynamic' ? this.props.value : 'id'
    }
  },
  watch: {
    value () {
      this.setNewValue()
    },
    multiple () {
      this.multiple ? (this.newValue = []) : (this.newValue = {})
    },
    '$store.state.codeEditor.components.formResetTimeStamp': function () {
      this.setNewValue()
    }
  },
  async created () {
    await this.getOptions()
    this.setNewValue()
  },
  methods: {
    setNewValue () {
      if (this.multiple) {
        this.newValue = this.value ? this.value.map((id) => ({ id })) : null // 这里只能给null，如果给了其他值，会触发表单校验
        const selectedItems = this.options.filter(item => this.value.includes(item.value.id))
        if (selectedItems.length) {
          this.$emit('change', selectedItems.map(item => (item.value)))
        } else {
          this.$emit('change', null)
        }
      } else {
        this.newValue = this.value ? { id: this.value } : null
        const selectedItems = this.options.filter(item => this.value === item.value.id)
        if (selectedItems.length) {
          this.$emit('change', selectedItems[0].value)
        } else {
          this.$emit('change', null)
        }
      }
    },
    selectorChange (val) {
      this.$emit('input', this.multiple ? val.map((item) => item.id) : val.id || '') // 修改value
      this.$emit('change', val) // 修改label
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
              this.options = respData.map(item => ({
                label: item[this.props.label],
                value: item
              }))
            })
            .catch((err) => {
              this.$message.error(String(err))
              console.error(err)
            })
        } else {
          this.$message.error('请填写接口地址')
        }
      } else {
        this.options = this.__slot__.options.map(item => ({
          label: item.label,
          value: item,
          disabled: item.disabled
        }))
      }
    }
  }
}
</script>
