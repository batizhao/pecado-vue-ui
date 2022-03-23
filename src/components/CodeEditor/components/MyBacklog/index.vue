<template>
  <el-card class="my-backlog" :body-style="{position: 'relative'}">
    <el-tabs v-model="activeName">
      <el-tab-pane label="我的待办" name="first">
        <div class="backlog-list">
          <div class="backlog-item" v-for="(item, index) in data" :key="index" @click="go(index)">
            <div class="backlog-item__title">{{ item.title }}</div>
            <div class="backlog-item__tag">{{ item.createName }}</div>
            <div class="backlog-item__date">{{ item.createTime }}</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="active">
      <el-button icon="el-icon-refresh" circle></el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'my-backlog',
  components: {},
  props: {
    url: String
  },
  data () {
    return {
      activeName: 'first',
      data: []
    }
  },
  computed: {},
  created () { },
  mounted () { 
    console.log('url：', this.url);
  },
  methods: {
    go (index) {
      this.$message('gogogogogo' + index);
    }
  },
  watch: {
    $attrs: {
      handler (val) {
        try {
          if (val.data.records) {
            this.data = val.data.records
          }
        } catch (error) { }
      },
      deep: true
    },
  }
}
</script>
<style lang="scss" scoped>
.active {
  position: absolute;
  right: 20px;
  top: 15px;
}
.backlog-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  &__title {
    width: calc(100% - 280px);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    padding-right: 100px;
  }
  &__tag,
  &__date {
    width: 100px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  &__tag {
    margin-right: 80px;
  }
}
</style>
