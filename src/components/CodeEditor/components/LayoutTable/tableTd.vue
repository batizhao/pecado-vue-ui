<template>
  <td v-bind="$attrs" :style="{height: $attrs.rowspan * 48 + 'px'}">
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
  display: table-cell;
  border: 1px dashed #369;
  padding: 3px;
}
</style>