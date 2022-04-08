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
      const { url, formDataId, operType } = this.$route.query
      if (url) {
        this.formContainerRef.submit().then(formData => {
          request({
            url,
            method: 'post',
            data: {
              ...formData,
              id: operType === 'edit' ? formDataId : undefined, // 从地址栏里拿id，有就是编辑操作，没有就是新增操作
              ...params
            }
          }).then(res => {
            !callback && this.msgSuccess('保存成功')
            // 新增的时候接口都会返回id，这时把新id存到formData中，以便后续其他按钮操作要用到这条数据的id
            this.$route.query.formDataId = res.data.id // 这样隐式放在query中，就不会改变路由触发页面变动
            callback && callback()
            if (operType === 'create') {
              this.buttonEmitReset()
            }
          })
        })
      } else {
        console.error('请求接口未配置')
      }
    },
    // 重置
    buttonEmitReset () {
      this.$route.query.formDataId = undefined
      this.formContainerRef.reset()
    },
    //关闭
    buttonEmitClose () {
        this.$router.go(-1)
    }
  }
}
</script>
