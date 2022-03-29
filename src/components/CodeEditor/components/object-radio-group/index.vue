<template>
  <el-radio-group v-model="newValue" @change="handleChange" v-bind="$attrs">
    <slot></slot>
  </el-radio-group>
</template>
<script>
export default {
  props: {
    value: String,
    __slot__: Object
  },
  computed: {
    newValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  mounted () {
    this.handleChange(this.newValue) 
  },
  methods: {
    handleChange (val) {
      const labels = this.__slot__.options.filter((item) => val === item.value)
      this.$emit('change', labels)
    }
  }
}
</script>
