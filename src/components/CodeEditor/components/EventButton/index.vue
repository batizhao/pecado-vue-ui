<template>
  <div>
    <el-button v-bind="$attrs" @click.prevent="click">
      <slot></slot>
    </el-button>

    <!-- 意见弹窗， 不能加v-if -->
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
        this.$refs.opinionRef.open(formData) // 打开意见弹窗
      })
    },
    // 保存
    async buttonEmitSave (callback, params) {
        const { createUrl, editUrl, createMethod, editMethod } = this.$route.query
        const url = createUrl || editUrl
        const method = createMethod || editMethod
        if (url) {
          const formDataId = this.$route.query.formDataId
          this.formContainerRef.submit().then(formData => {
            request({
              url,
              method,
              data: {
                ...formData,
                id: editUrl ? formDataId : undefined, // 从地址栏里拿id，有就是编辑操作，没有就是新增操作
                ...params
              }
            }).then(res => {
              !callback && this.msgSuccess('保存成功')
              // 新增的时候接口都会返回id，这时把新id存到formData中，以便后续其他按钮操作要用到这条数据的id
              this.$route.query.formDataId = res.data.id // 这样隐式放在query中，就不会改变路由触发页面变动
              callback && callback()

            })
          })
        } else {
          // 如果不是从表单的新增或编辑按钮跳转过来的，就要查询保存接口地址，这里必然是执行的数据新增操作，因为没有数据id
          const res = await getDataDetail(this.$route.query.pageModelCode)
          const submitURL = res.data.submitURL
          this.formContainerRef.submit().then(formData => {
            request({
              url: submitURL,
              method: 'post',
              data: {
                ...formData,
                ...params
              }
            }).then(res => {
              !callback && this.msgSuccess('保存成功')
              this.$route.query.formDataId = res.data.id
              callback && callback()
            })
          })
        }
    },
    // 重置
    buttonEmitReset () {
      this.$route.query.formDataId = undefined
      this.formContainerRef.reset()
    }
  }
}
</script>
