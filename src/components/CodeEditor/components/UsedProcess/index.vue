<template>
  <el-card :body-style="{position: 'relative'}">
    <div slot="header" class="">
      <span>常用流程</span>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户管理" name="first">
        <div class="process-list">
          <a class="process-item" v-for="item in 4" :key="item">
            常用流程{{item}}
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
  name:'used-process',
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

.active{
  position: absolute;
  right:20px;
  top:15px;
}
.process-list{
  display: flex;
  flex-wrap: wrap;
}
.process-item{
  display: inline-block;
  height: 28px;
  line-height: 28px;
  width:50%;
  color:#1890ff;
  &:hover{
    color: lighten($color: #1890ff, $amount: 10)
  }
}
</style>


