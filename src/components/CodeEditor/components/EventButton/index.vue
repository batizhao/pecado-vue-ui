<template>
  <div>
    <el-button v-bind="$attrs" @click.prevent="click">
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
import mixins from './mixins'
export default {
  name: 'event-button',
  mixins: [mixins],
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
