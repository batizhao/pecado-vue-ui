<template>
  <el-card class="login-log" :body-style="{position: 'relative'}">
    <div slot="header" class="">
      <span>登录日志</span>
    </div>
    <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in loginLogList"
      :key="index"
      :timestamp="activity.timestamp">
      {{activity.content+' '}}登陆系统
    </el-timeline-item>
  </el-timeline>
  </el-card>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'login-log',
  components: {},
  props: {
    url: String
  },
  data () {
    return {
        reverse: false,
        loginLogList: [{
          content: '张三',
          timestamp: '2018年4月15日 13:04'
        }, {
          content: '王五',
          timestamp: '2018年4月14日 13:04'
        }, {
          content: '李四',
          timestamp: '2018年4月13日 13:04'
        }]
    }
  },
  created () {
    this.getLoginLogList()
  },
  methods: {
    // 获取登录日志信息
    getLoginLogList () {
      request({
        url: this.url,
        method: 'get'
      }).then(res => {
        // this.loginLogList = res.data
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.el-timeline-item{
    margin-left: 50%;
}
::v-deep .el-timeline-item__timestamp{
    position: absolute;
    top: 3px;
    left: -150px;
    margin-top: 0;
}
</style>
