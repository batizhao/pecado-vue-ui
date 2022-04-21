<template>
  <el-card class="common-use" :body-style="{position: 'relative'}">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="'常用应用('+commonUseList.length+')'" name="first">
          <div class="useBox">
              <div class="everyUse" v-for="(item,index) in commonUseList" :key="index">
                  <i :class="item.icon"></i>
                  <span @click="jumpToForm(item)">{{item.name}}</span>
              </div>
          </div>
      </el-tab-pane>
    </el-tabs>
    <div class="active">
      <el-button icon="el-icon-refresh" circle @click="getCommonUseList"></el-button>
    </div>
  </el-card>
</template>

<script>
import request from '@/utils/request'
import { analysisUrl } from '../MyBacklog/analysisUrl'
export default {
  name: 'common-use',
  components: {},
  props: {
    url: String
  },
  data () {
    return {
      activeName: 'first',
      commonUseList: [
          {
              icon:'el-icon-user',
              name:'会议申请流程',
              url:''
          }
      ]
    }
  },
  created () {
    this.getCommonUseList()
  },
  methods: {
    // 获取常用应用的列表
    getCommonUseList () {
    //   request({
    //     url: this.url,
    //     method: 'get'
    //   }).then(res => {
    //     this.commonUseList = res.data.records || []
    //   })
    },
    // 跳转
    jumpToForm (item) {
      this.$router.push({
        path: analysisUrl(item.url, item),
        query: {
          taskId: item.taskId
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.active {
  position: absolute;
  right: 20px;
  top: 15px;
  .el-button {
    padding: 6px;
    font-size: 10px;
  }
}
.useBox{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    .everyUse{
        margin-bottom: 10px;
        width: 150px;
        color: #1890ff;
        i{
            margin-right: 5px;
        }
        span{
            &:hover {
                cursor: pointer;
            }
        }
    }
}
</style>
