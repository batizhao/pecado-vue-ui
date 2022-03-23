<template>
  <action-dialog v-model="visible" title="选择图标" width="80%" @confirm="confirm">
    <el-tabs v-model="activeName">
      <el-tab-pane label="FontAwesome" name="first">
        <ul class="icon-list">
          <li
            v-for="(item, index) in iconList"
            :key="index"
            @click="chooseIcon(item)"
            :class="{ active: 'fa fa-' + item === currentIcon}"
          >
            <i :class="'fa fa-' + item"></i>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="Element" name="second">
        <ul class="icon-list">
          <li
            v-for="(item, index) in elementIconList"
            :key="index"
            @click="chooseElIcon(item)"
            :class="{ active: item === currentIcon}"
          >
            <i :class="item"></i>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </action-dialog>
</template>

<script>
import iconList from './iconList.js'
import elementIconList from './elementIconList.js'
export default {
  props: {
    value: String
  },
  data () {
    return {
      visible: false,
      iconList,
      elementIconList,
      currentIcon: '',
      activeName: 'first'
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    confirm () {
      this.visible = false
      this.$emit('input', this.currentIcon)
    },
    chooseIcon (icon) {
      this.currentIcon = 'fa fa-' + icon
    },
    chooseElIcon (icon) {
      this.currentIcon = icon
    }
  }
  
}
</script>

<style lang="scss" scoped>
$liSize: 40px;
.icon-list {
  display: flex;
  flex-wrap: wrap;
  font-size: 18px;
  & > li {
    height: $liSize;
    width: $liSize;
    text-align: center;
    line-height: $liSize;
    border-radius: 2px;
    &:hover, &.active {
      background: #4a4a48;
      color: #fff;
    }
  }
}
</style>