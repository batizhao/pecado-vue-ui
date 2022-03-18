<template>
  <div>
    <el-button v-bind="$attrs" @click.prevent="click">
      <slot></slot>
    </el-button>

    <!-- 意见弹窗 -->
    <opinion ref="opinionRef"></opinion>
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
      
    }
  },
  methods: {
    click () {
      if (!this.eventSettings) return
      const emit = this.eventSettings.emit
      if (!emit) return
      // 通过回调获取表单容器的ref节点
      this.$emit('nativeClick', formContainerRef => {
        this[emit](formContainerRef)
      })
    },
    // 提交
    buttonEmitSubmit (formContainerRef) {
      formContainerRef.submit().then(formData => {
        console.log("🚀 ~ file: index.vue ~ line 32 ~ buttonEmitSubmit ~ formData", formData)
      })
      this.$refs.opinionRef.open() // 打开意见弹窗
    },
    // 保存
    async buttonEmitSave (formContainerRef) {
      console.log("🚀 ~ file: index.vue ~ line 45 ~ buttonEmitSave ~ formContainerRef", formContainerRef)
      // 查询保存接口地址
      if (!this.submitURL) {
        const res = await getDataDetail(this.$route.query.pageModelCode)
        const submitURL = res.data.submitURL
        if (!submitURL) {
          this.msgError('未配置保存接口地址')
          return
        } else {
          this.submitURL = submitURL
        }
      }
        formContainerRef.submit().then(formData => {
          request({
            url: this.submitURL,
            method: 'post',
            data: formData
          }).then(() => {
            this.msgSuccess('保存成功')
          })

        })
    },
    // 重置
    buttonEmitReset (formContainerRef) {
      formContainerRef.reset()
    }
  }
}
</script>
