<template>
  <div>
    <el-button v-bind="$attrs" @click.prevent="click">
      <slot></slot>
    </el-button>

    <!-- 意见弹窗 -->
    <opinion ref="opinionRef" @buttonEmitSave="buttonEmitSave"></opinion>
  </div>
</template>

<script>
import opinion from './opinion.vue'
import { getDataDetail } from '@/api/app/formModel.js'
import request from '@/utils/request'
export default {
  components: { opinion },
  inheritAttrs: false,
  name: 'event-button',
  props: {
    eventSettings: Object
  },
  data () {
    return {
      formContainerRef: null
    }
  },
  methods: {
    click () {
      if (!this.eventSettings) return
      const emit = this.eventSettings.emit
      if (!emit) return
      // 通过回调获取表单容器的ref节点
      this.$emit('nativeClick', formContainerRef => {
        this.formContainerRef = formContainerRef
        this[emit]()
      })
    },
    // 提交
    buttonEmitSubmit () {
      this.formContainerRef.submit().then(formData => {
        console.log("🚀 ~ file: index.vue ~ line 32 ~ buttonEmitSubmit ~ formData", formData)
        this.$refs.opinionRef.open() // 打开意见弹窗
      })
    },
    // 保存
    async buttonEmitSave (callback) {
        const { createUrl, editUrl, createMethod, editMethod } = this.$route.query
        const url = createUrl || editUrl
        const method = createMethod || editMethod
        if (url) {
          this.formContainerRef.submit().then(formData => {
            request({
              url,
              method,
              data: formData
            }).then(res => {
              this.msgSuccess('保存成功')
              callback && callback(res)
            })
          })
        } else {
          // 查询保存接口地址
          const res = await getDataDetail(this.$route.query.pageModelCode)
          const submitURL = res.data.submitURL
          this.formContainerRef.submit().then(formData => {
            request({
              url: submitURL,
              method: 'post',
              data: formData
            }).then(res => {
              this.msgSuccess('保存成功')
              callback && callback(res)
            })
          })
        }
    },
    // 重置
    buttonEmitReset () {
      this.formContainerRef.reset()
    }
  }
}
</script>
