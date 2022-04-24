<template>
  <div class="page-container" :class="{'gray-back': !parserFormConf}">
    <parser
      v-if="parserShow && parserFormConf"
      :form-conf="parserFormConf"
      :showSubmit="false"
    />
    <div class="tip" v-else>{{`页面容器 ${errorTip}`}}</div>
  </div>
</template>

<script>
import Parser from '@/components/CodeEditor/components/parser/Parser.vue'
import { getTemplateDetail } from '@/api/dp/page/model.js'
export default {
  name: 'page-container',
  components: {
    Parser
  },
  props: {
  },
  data () {
    return {
      parserFormConf: null,
      parserShow: true,
      errorTip: ''
    }
  },
  watch: {
    $route () {
      this.setDefault()
    }
  },
  created () {
    this.setDefault()
  },
  methods: {
    setDefault () {
      const { appPageCode, pageModelCode } = this.$route.query
      if (appPageCode) {
        this.getFrame({ appPageCode, pageModelCode })
      }
    },
    // 获取框架
    getFrame({ appPageCode, pageModelCode }){
      // 通过appPageCode查询出页面模型的类型
      // 根据类型决定渲染什么页面
      this.parserShow = false
      getTemplateDetail(appPageCode).then(res => {
        const pageMetadata = JSON.parse(res.data.pageMetadata)
        if (pageMetadata && Object.keys(pageMetadata).length) {
          if (res.data.type === 'form') {
            this.getFormContainerData(pageMetadata.fields, pageModelCode)
          }
          if (res.data.type === 'list') {
            this.getListContainerData(pageMetadata.fields, pageModelCode)
          }
          this.parserFormConf = pageMetadata
          this.parserShow = true
        }
      })
    },
    // 针对表单容器要传入pageModelCode查询页面JSON
    getFormContainerData (fields, pageModelCode) {
      // 找到表单容器，并给url赋值
      const recursion = list => {
        for (let item of list) {
          if (item.__config__.tag === 'form-container') {
            item.url = '/app/form?key=' + pageModelCode
          }
          if (item.children && item.children.length) {
            recursion(item.children)
          }
        }
      }
      recursion(fields)
    },
    // 针对列表容器要传入pageModelCode查询页面的数据配置
    getListContainerData (fields, pageModelCode) {
      // 找到列表容器，并给url赋值
      const recursion = list => {
        for (let item of list) {
          if (item.__config__.tag === 'list-container') {
            item.url = '/app/list/by/' + pageModelCode
          }
          if (item.children && item.children.length) {
            recursion(item.children)
          }
        }
      }
      recursion(fields)
    },
  }
}
</script>

<style scoped>
.page-container {
  min-height: 300px;
}
.page-container > .tip {
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
