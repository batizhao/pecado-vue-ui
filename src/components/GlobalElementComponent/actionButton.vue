<template>
  <el-button
    class="action-button"
    :size="newSize"
    :plain="newPlain"
    :type="newType"
    :icon="newIcon"
    :loading="loading"
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
    size: {
      type: String,
      default: 'mini'
    },
    icon: String,
    actionType: String, // 1 新增按钮 2 删除按钮 3 位于表格操作栏中的按钮
    loading: Boolean
  },
  computed: {
    newIcon () {
      if (this.actionType === '1') {
        return 'el-icon-plus'
      } else if (this.actionType === '2') {
        return 'el-icon-delete'
      } else {
        return this.icon
      }
    },
    newType () {
      if (this.actionType === '1') {
        return 'primary'
      } else if (this.actionType === '2') {
        return 'danger'
      } else if (this.actionType === '3') {
        return 'text'
      } else {
        return this.type
      }
    },
    newPlain () {
      if (this.actionType === '3') return false
      return this.plain
    },
    newSize () {
      if (this.actionType === '3') return undefined
      return this.size
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
  margin: 0 5px 2px 5px;
}
</style>