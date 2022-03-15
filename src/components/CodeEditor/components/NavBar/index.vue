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
          {item.label}
        </el-menu-item>
      )
    }
    const getElSubmenu = (item) => {
      const getElSubmenuChildren = (list) => {
        return list.map((item) => {
          return item.children ? getElSubmenu(item) : getElMenuItem(item)
        })
      }
      return <el-submenu index={item.index}>
        <span slot="title">{item.label}</span>
        {getElSubmenuChildren(item.children)}
      </el-submenu>
    }
    const getElMenuChildren = (data) => {
      return data.map((item) => {
        return item.children ? getElSubmenu(item) : getElMenuItem(item)
      })
    }
    // 注意props的传入
    return(
      <el-menu props={this.$attrs} onSelect={this.elMenuSelect}>
        {getElMenuChildren(this.menuData)}
      </el-menu>
    )
  }
}
</script>
