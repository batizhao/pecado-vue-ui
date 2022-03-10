<template>
  <div class="form-container" :class="{'gray-back': !formConf}">
    <parser
      ref="parseRef"
      v-if="formConf"
      :form-conf="formConf"
      :showSubmit="false"
    ></parser>
    <span class="tip" v-else>表单容器</span>
  </div>
</template>

<script>
import Parser from '@/components/CodeEditor/components/parser/Parser.vue'
import request from '@/utils/request'
export default {
  name: 'form-container',
  components: {
    Parser
  },
  props: {
    url: String // 请求地址
  },
  data () {
    return {
      formConf: null
    }
  },
  methods: {
    getFormConf () {
      request({
        url:  this.url,
        method: 'get'
      }).then(res => {
        const data = JSON.parse(res.data.metadata).formData
        data.isForm = true
        this.formConf = data
      })
    },
    submit () {
      return this.$refs.parseRef.submitForm()
    }
  },
  created () {
    this.getFormConf()
  }
}
</script>

<style scoped>
.form-container {
  min-height: 300px;
  padding: 0 8%;
}
.form-container > .tip {
  text-align: center;
  line-height: 300px;
  font-size: 18px;
  color: gray;
  letter-spacing: 2px;
}
.gray-back {
  background: #dbdbdb;
}
</style>>
