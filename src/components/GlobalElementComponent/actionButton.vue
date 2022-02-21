<template>
  <el-button
    class="action-button"
    plain
    size="mini"
    :type="type"
    :icon="icon"
    @click="click"
  >
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    plain: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: 'el-icon-plus'
    }
  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.action-button {
  margin: 0 5px;
}
</style>