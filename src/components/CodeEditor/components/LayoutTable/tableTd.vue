<template>
  <td v-bind="$attrs" :style="{height: $attrs.rowspan * 48 + 'px'}" class="layout-table-td">
    <slot></slot>
  </td>
</template>

<script>
export default {
  name: 'table-td'
}
</script>
