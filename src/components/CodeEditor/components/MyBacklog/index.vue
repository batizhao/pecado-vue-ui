<template>
  <el-card class="my-backlog" :body-style="{position: 'relative'}">
    <el-tabs v-model="activeName">
      <el-tab-pane label="我的待办" name="first">
        <div class="backlog-list">
          <div class="backlog-item" v-for="(item, index) in unfinishedList" :key="index" @click="jumpToForm(item)">
            <div class="backlog-item__title">{{ item.title }}</div>
            <div class="backlog-item__tag">{{ item.createName }}</div>
            <div class="backlog-item__date">{{ item.createTime }}</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="active">
      <el-button icon="el-icon-refresh" circle @click="getUnfinishedList"></el-button>
    </div>
  </el-card>
</template>

<script>
import request from '@/utils/request'
import { analysisUrl } from '../ListContainer/analysisUrl'
export default {
  name: 'my-backlog',
  components: {},
  props: {
    url: String
  },
  data () {
    return {
      activeName: 'first',
      unfinishedList: []
    }
  },
  created () {
    this.getUnfinishedList()
  },
  methods: {
    // 获取代码的列表
    getUnfinishedList () {
      request({
        url: this.url,
        method: 'get'
      }).then(res => {
        this.unfinishedList = res.data.records || []
      })
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
.backlog-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  font-size: 14px;
  &__title {
    width: calc(100% - 280px);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    padding-right: 100px;
    color: #1890ff;
  }
  &__tag,
  &__date {
    width: 190px;
    color: #98a5ba;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  &__tag {
    margin-right: 80px;
  }
  &:hover {
    background: #f6faff;
    cursor: pointer;
  }
}
</style>
