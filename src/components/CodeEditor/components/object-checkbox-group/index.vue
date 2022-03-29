<template>
  <el-checkbox-group v-model="newValue" @change="handleChange" v-bind="$attrs">
    <slot></slot>
  </el-checkbox-group>
</template>
<script>
export default {
  props: {
    value: Array,
    __slot__: Object
  },
  computed: {
    newValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.handleChange(this.newValue)
  },
  methods: {
    handleChange(val) {
      let labels = this.__slot__.options
        .filter((item) => {
          return val.includes(item.value)
        })
      this.$emit('change', labels)
    }
  }
}
</script>
