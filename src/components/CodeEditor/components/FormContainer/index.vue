<template>
  <div class="form-container" :class="{'gray-back': !url}">
    <parser
      ref="parseRef"
      v-if="formConf"
      :form-conf="formConf"
      :showSubmit="false"
      :editData="editData"
    ></parser>
    <div class="tip" v-else>{{`表单容器 ${errorTip}`}}</div>
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
      formConf: null,
      editData: null,
      errorTip: ''
    }
  },
  methods: {
    async getFormConf () {
      if (!this.url) return
      // 如果是编辑或者详情页 就要获取数据做一下数据回填
      await this.getFormData()
      request({
        url:  this.url,
        method: 'get'
      }).then(res => {
        const data = JSON.parse(res.data.metadata).formData
        data.isForm = true
        this.formConf = data
      }).catch(err => {
        this.errorTip = err
      })
    },
    // 获取表单数据
    getFormData () {
      return new Promise((resolve, reject) => {
        const { detailUrl } = this.$route.query
        if (detailUrl) {
          request({
            url: detailUrl
          }).then(res => {
            this.editData = res.data
            resolve()
          })
        } else {
          resolve()
        }
      })
    },
    submit () {
      if (!this.formConf) return Promise.reject()
      return this.$refs.parseRef.submitForm()
    },
    reset () {
      if (!this.formConf) return Promise.reject()
      return this.$refs.parseRef.resetForm()
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
