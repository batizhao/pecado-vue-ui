<template>
  <el-card :body-style="{position: 'relative'}">
    <div slot="header" class="">
      <span>通知公告</span>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户管理" name="first">
        <div class="notice-list">
          <a class="notice-item">
            <div class="notice-item__title">管理员申请彩购</div>
            <div class="notice-item__mate">
              <div class="notice-item__tag">管理员</div>
              <div class="notice-item__date">2022-02-25</div>
            </div>
          </a>
          <a class="notice-item">
            <div class="notice-item__title">管理员申请彩购</div>
            <div class="notice-item__mate">
              <div class="notice-item__tag">管理员</div>
              <div class="notice-item__date">2022-02-25</div>
            </div>
          </a>
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
  name:'notice',
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
.my-notice{
  // position: relative;
}
.active{
  position: absolute;
  right:20px;
  top:15px;
}
.notice-item{
  display: flex;
  justify-content: space-between;

  &__mate{
    display: flex;
    justify-content: flex-end;
    min-width: 200px;
  }
  &__title{
    flex:1;
    color:#1890ff;
    &:hover{
      color: lighten($color: #1890ff, $amount: 10)
    }
  }
  &__tag,&__date{
    width:100px;
    color: #333;
  }
}
</style>
