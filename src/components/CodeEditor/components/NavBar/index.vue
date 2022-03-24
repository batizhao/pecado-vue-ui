<script>
export default {
  name: 'nav-bar',
  props: {
    menuData: Array
  },
  methods: {
    elMenuItemClick (item) {
      this.$emit('selectItem', item)
    },
    elMenuSelect (key, keyPath) {
      this.$emit('select', key, keyPath)
    }
  },
  render (h) {
    const getElMenuItem = (item) => {
      return (
        <el-menu-item index={item.index} onClick={() => this.elMenuItemClick(item)}>
          <template slot="title">
            <i class={item.icon + ' nav-bar-icon'}></i>
            <span>{item.label}</span>
          </template>
        </el-menu-item>
      )
    }
    const getElSubmenu = (item) => {
      const getElSubmenuChildren = (list) => {
        return list.map((item) => {
          return item.children && item.children.length ? getElSubmenu(item) : getElMenuItem(item)
        })
      }
      return <el-submenu index={item.index}>
        <template slot="title">
          <i class={item.icon + ' nav-bar-icon'}></i>
          <span>{item.label}</span>
        </template>
        {getElSubmenuChildren(item.children)}
      </el-submenu>
    }
    const getElMenuChildren = (data) => {
      return data.map((item) => {
        return item.children && item.children.length ? getElSubmenu(item) : getElMenuItem(item)
      })
    }
    // 注意props的传入
    return(
      <el-menu props={this.$attrs} onSelect={this.elMenuSelect}>
        {this.menuData && getElMenuChildren(this.menuData)}
      </el-menu>
    )
  }
}
</script>
<style scoped>
.nav-bar-icon {
  font-size: 10px;
  color: #515151;
  margin-right: 5px;
}
</style>