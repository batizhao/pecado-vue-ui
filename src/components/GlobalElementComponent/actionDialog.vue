<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <slot></slot>
    <div slot="footer">
      <el-button type="primary" @click="confirm" size="small" :loading="loading">确 定</el-button>
      <el-button @click="cancel" size="small">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    title: {
      type: String,
      default: '标题'
    },
    width: {
      type: String,
      default: '50%'
    },
    loading: Boolean
  },
  data () {
    return {
      // submitLoading: false
    }
  },
  computed: {
    visible: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.visible = false
      this.$emit('cancel')
    }
  }
}
</script>

<style>

</style>