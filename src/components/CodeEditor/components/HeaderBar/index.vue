<template>
  <div class="header-bar">
    <div class="logo-img">
      <img src="@/assets/logo/logo.png" />
      <h5 class="logo-title">低代码平台</h5>
    </div>
    <div class="nav-bar">
      <render-menu :menuData="menuData" mode="horizontal"></render-menu>
    </div>
    <div class="actions">
      <i class="el-icon-monitor" title="控制台" @click="jumpToManager"></i>
      <i class="el-icon-menu menu" title="菜单" @click="changeNavbarShow"></i>
    </div>
  </div>
</template>

<script>
import renderMenu from '../NavBar/renderMenu.vue'
export default {
  name:'header-bar',
  components: {
    renderMenu
  },
  props:{
    },
  data(){
    return {
      menuData: []
    }
  },
  methods:{
    jumpToManager () {
      this.$router.push({
        path: '/admin'
      })
    },
    changeNavbarShow () {
      this.$store.commit('codeEditor/navbar/setNavbarShow', !this.$store.state.codeEditor.navbar.navbarShow)
    }
  },
}
</script>
<style lang="scss">
.header-bar{
  display: flex;
  align-items: center;
  height: 50px;
  background: #2f54eb;
  justify-content: space-between;
  .logo-img{
    padding: 0 20px;
    display: flex;
    align-items: center;
    img {
      height: 40px;
    }
    .logo-title {
      color: #fff;
      margin: 0;
      letter-spacing: 1px;
      font-size: 17px;
      padding-left: 10px;
    }
  }
  .nav-bar{
    .el-menu--horizontal {
      background: unset;
      & > .el-menu-item {
        height: 50px;
        line-height: 50px;
        border-bottom: none;
        color: #fff;
      }
      & > .el-menu-item:not(.is-disabled):hover,
      & > .el-menu-item:not(.is-disabled):focus {
        background-color: #2b89ea;
      }
    }
  }
  .actions{
    display: flex;
    height: 100%;
    align-items: center;
    color: #fff;
    & > i {
      cursor: pointer;
      margin-right: 16px;
    }
  }
  .nav-bar-icon {
    color: #fff !important;
  }
}
@media screen and (min-width: 993px)  {
  .actions .menu {
    display: none;
  }
}
</style>