<template>
  <td v-bind="$attrs">
    <slot></slot>
  </td>
</template>

<script>
export default {
  name: 'table-td'
}
</script>

<style lang="scss" scoped>
td {
  height: 48px;
  border: 1px dashed #369;
  padding: 3px;
}
</style>