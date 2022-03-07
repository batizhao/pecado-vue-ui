<template>
  <div class="header-bar">
    <div class="logo-img"><img src="@/assets/logo/logo.png" /></div>
    <div class="nav-bar">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="3">消息中心</el-menu-item>
        <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
      </el-menu>
    </div>
    <div class="actions">
      <div class="user">
        <i class="el-icon-user-solid" style="font-size:18px"></i>admin

      </div>
      <div class="firm-cut">
        当前单位：
        <el-select v-model="value" size="mini" placeholder="请选择" style="width:100px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'header-bar',
  props:{},
  data(){
    return {
      activeIndex: '1',
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
    }
  },
  methods:{
    handleSelect(){}
  },
}
</script>
<style lang="scss" scoped>
.header-bar{
  display: flex;
  align-items: center;
  height: 54px;
  overflow: hidden;
}
.logo-img{
  padding: 0 20px;
  display: flex;
  align-items: center;
}
.nav-bar{
  flex:1;
}
.actions{
  display: flex;
  height: 100%;
  padding:0 20px;
  align-items: center;
  .user{
    padding-right:20px;
    i{
      margin-right:6px;
    }
  }
}

</style>
