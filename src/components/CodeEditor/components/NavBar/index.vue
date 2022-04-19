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
        this.setBreadcrumbNames(id)
      } else {
        // 默认选中第一个菜单
        this.navBarSelect(this.navBarMenuData[0])
        this.sideActiveIndex = this.navBarMenuData[0].id.toString()
      }
    },
    // 侧边菜单选中事件
    navBarSelect (data) {
      const currentPath = this.$route.path
      if (currentPath !== '/home') return   // 让导航点击事件在/home页面才生效
      this.$router.push({
        path: currentPath,
        query: {
          id: data.id,
          appId: data.appId,
          appPageCode: data.appPageCode,
          pageModelCode: data.pageModelCode
        }
      })
      this.setBreadcrumbNames(data.id)
    },
    // 设置面包屑数据
    setBreadcrumbNames (menuId) {
      // 查询父级菜单的名称
      let parentNames = []
      let menuName = ''
      const recursion = (list, name) => {
        for (let item of list) {
          if (name !== undefined) {
            !item.parentNames && (item.parentNames = [])
            item.parentNames.push(name)
          }
          if (String(item.id) === String(menuId)) {
            parentNames = item.parentNames || []
            menuName = item.name
          }
          if (item.children && item.children.length) {
            recursion(item.children, item.name)
          }
        }
      }
      recursion(JSON.parse(JSON.stringify(this.navBarMenuData)))
      this.$store.commit('codeEditor/breadcrumb/setBreadcrumbNames', [
        ...parentNames.map(item => ({ name: item })),
        {
          name: menuName,
          search: location.search
        }
      ])

    },
    // 获取侧边栏菜单数据
    getNavBarData () {
      return getNavBarData().then(res => {
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
        }
      })
    }
  }
}
</script>

<style>

</style>