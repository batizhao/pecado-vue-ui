<template>
  <div>
    <render-menu
      v-if="sideActiveIndex"
      :menuData="navBarMenuData"
      :default-active="sideActiveIndex"
      @selectItem="navBarSelect"
    ></render-menu>
  </div>
</template>

<script>
import renderMenu from './renderMenu.vue'
import { getNavBarData } from '@/api/app/menu.js'
export default {
  name: 'nav-bar',
  components: {
    renderMenu
  },
  props: {
    menuData: Array
  },
  async created () {
    await this.getNavBarData()
    this.setDefault()
  },
  data () {
    return {
      navBarMenuData: [],
      sideActiveIndex: ''
    }
  },
  methods: {
    setDefault () {
      const { id } = this.$route.query
      if (id) {
        this.sideActiveIndex = id.toString()
        console.log("🚀 ~ file: index.vue ~ line 36 ~ setDefault ~ id.toString()", id.toString())
      } else {
        // 默认选中第一个菜单
        this.navBarSelect(this.navBarMenuData[0])
        this.sideActiveIndex = this.navBarMenuData[0].id.toString()
      }
    },
    // 侧边菜单选中事件
    navBarSelect (data) {
      const currentPath = this.$route.path
      this.$router.push({
        path: currentPath,
        query: {
          id: data.id,
          appId: data.appId,
          appPageCode: data.appPageCode,
          pageModelCode: data.pageModelCode
        }
      })
    },
    // 获取侧边栏菜单数据
    getNavBarData () {
      return getNavBarData().then(res => {
        console.log("🚀 ~ file: index.vue ~ line 59 ~ returngetNavBarData ~ this.menudata", this.menuData)
        if (res.data && res.data.length ) {
          const recursion = list => {
            for (let item of list) {
              item.label = item.name
              item.index = String(item.id)
              if (item.children && item.children.length) {
                recursion(item.children)
              }
            }
          }
          recursion(res.data)
          this.navBarMenuData = res.data
        } else {
          this.navBarMenuData = this.menuData
        }
      }).catch(() => {
        this.navBarMenuData = this.menuData
      })
    }
  }
}
</script>

<style>

</style>