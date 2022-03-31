<template>
  <el-date-picker
    v-model="newValue"
    v-bind="$attrs"
    @change="handleChange"
    @focus="(event) => $emit('focus', event)"
    @blur="(event) => $emit('blur', event)"
  ></el-date-picker>
</template>

<script>
export default {
  props: {
    value: Array,
    props: Object
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
  created() {
    this.handleChange(this.value)
  },
  methods: {
    handleChange(val) {
      this.$emit('change', val || [])
    }
  }
}
</script>
