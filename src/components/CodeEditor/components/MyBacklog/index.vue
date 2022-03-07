<template>
  <el-card class="my-backlog" :body-style="{position: 'relative'}">
    <div slot="header" class="">
      <span>我的待办</span>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户管理" name="first">
        <div class="backlog-list">
          <a class="backlog-item">
            <div class="backlog-item__title">管理员申请彩购</div>
            <div class="backlog-item__mate">
              <div class="backlog-item__tag">管理员</div>
              <div class="backlog-item__date">2022-02-25</div>
            </div>
          </a>
          <a class="backlog-item">
            <div class="backlog-item__title">管理员申请彩购</div>
            <div class="backlog-item__mate">
              <div class="backlog-item__tag">管理员</div>
              <div class="backlog-item__date">2022-02-25</div>
            </div>
          </a>
        </div>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <a class="backlog-list">
          <div class="backlog-item">
            <div class="backlog-item__title">管理员申请彩购1</div>
            <div class="backlog-item__mate">
              <div class="backlog-item__tag">管理员</div>
              <div class="backlog-item__date">2022-02-25</div>
            </div>
          </div>
        </a>
      </el-tab-pane>
    </el-tabs>

    <div class="active">
      <el-button icon="el-icon-refresh" circle></el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name:'my-backlog',
  components:{},
  props:{},
  data(){
    return {
      activeName:'first'
    }
  },
  computed:{},
  created(){},
  mounted(){},
  methods:{},
  watch:{}
}
</script>
<style lang="scss" scoped>
.my-backlog{
  // position: relative;
}
.active{
  position: absolute;
  right:20px;
  top:15px;
}
.backlog-item{
  display: flex;
  justify-content: space-between;

  &__mate{
    display: flex;
    justify-content: flex-end;
    min-width: 200px;
  }
  &__title{
    flex:1
  }
  &__tag,&__date{
    width:100px;
    color: #333;
  }
}
</style>
