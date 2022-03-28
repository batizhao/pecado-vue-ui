<template>
  <div class="icon-dialog">
    <el-dialog
      v-bind="$attrs"
      width="80%"
      :modal="false"
      v-on="$listeners"
      @open="onOpen"
    >
      <div slot="title">
        <span>搜索图标：</span>
        <el-input
          v-model="key"
          size="mini"
          :style="{width: '260px'}"
          placeholder="请输入图标名称"
          prefix-icon="el-icon-search"
          clearable
        />
      </div>
      <ul class="icon-ul">
        <li
          v-for="icon in iconList"
          :key="icon"
          :class="active===icon?'active-item':''"
          @click="onSelect(icon)"
        >
          <i :class="icon" />
          <div>{{icon}}</div>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>
<script>
import iconList from '../../../utils/icon.json'

const originList = iconList.map(name => `el-icon-${name}`)

export default {
  inheritAttrs: false,
  props: ['current'],
  data () {
    return {
      iconList: originList,
      active: null,
      key: ''
    }
  },
  watch: {
    key (val) {
      if (val) {
        this.iconList = originList.filter(name => name.indexOf(val) > -1)
      } else {
        this.iconList = originList
      }
    }
  },
  methods: {
    onOpen () {
      this.active = this.current
      this.key = ''
    },
    onSelect (icon) {
      this.active = icon
      this.$emit('select', icon)
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-ul {
  margin: 0;
  padding: 0;
  font-size: 0;
  height: 59vh;
  overflow: auto;
  li {
    display: inline-block;
    list-style-type: none;
    box-sizing: border-box;
    padding: 6px;
    width: 16.66%;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
    &:hover {
      background: #f2f2f2;
    }
    &.active-item {
      background: #e1f3fb;
      color: dodgerblue;
    }
    > i {
      line-height: 50px;
      font-size: 30px;
    }
  }
}
</style>
