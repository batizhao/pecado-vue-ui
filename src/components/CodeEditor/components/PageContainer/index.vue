<template>
  <div class="page-container" :class="{'gray-back': !url}">
    <parser
      v-if="pageConf"
    ></parser>
    <div class="tip" v-else>{{`页面容器 ${errorTip}`}}</div>
  </div>
</template>

<script>
import Parser from '@/components/CodeEditor/components/parser/Parser.vue'
import request from '@/utils/request'
export default {
  name: 'page-container',
  components: {
    Parser
  },
  props: {
  },
  data () {
    return {
      pageConf: null,
      errorTip: ''
    }
  },
  methods: {
    getPageFrame () {

    }
  },
  created () {
    this.getPageFrame()
  }
}
</script>

<style scoped>
.page-container {
  min-height: 300px;
  padding: 0 8%;
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
