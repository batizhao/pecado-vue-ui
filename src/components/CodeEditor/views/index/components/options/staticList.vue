<template>
  <div>
    <draggable
      :list="activeData.__slot__.options"
      :animation="340"
      group="selectItem"
      handle=".option-drag"
    >
      <div
        v-for="(item, index) in activeData.__slot__.options"
        :key="index"
        class="select-item"
      >
        <div class="select-line-icon option-drag">
          <i class="el-icon-s-operation" />
        </div>
        <el-input
          v-model="item[activeData.props.props.label]"
          placeholder="选项名"
          size="small"
          @change="changeRenderKey"
        />
        <el-input
          v-model="item[activeData.props.props.value]"
          placeholder="值"
          size="small"
          @change="changeRenderKey"
        />
        <div
          class="close-btn select-line-icon"
          @click="activeData.__slot__.options.splice(index, 1);changeRenderKey()"
        >
          <i class="el-icon-delete" />
        </div>
      </div>
    </draggable>
    <div style="margin-left: 20px">
      <el-button
        style="padding-bottom: 0"
        icon="el-icon-circle-plus-outline"
        type="text"
        @click="addSelectItem"
      >
        添加选项
      </el-button>
      <el-button
        icon="el-icon-edit-outline"
        type="text"
        @click="editStaticData"
      >
        JSON数据
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeData: Object
  },
  methods: {
    changeRenderKey () {
      this.$emit('changeRenderKey')
    },
    editStaticData () {
      this.$emit('editStaticData', this.activeData.__slot__.options)
    },
    // 添加下拉框选项
    addSelectItem() {
      this.activeData.__slot__.options.push({
        [this.activeData.props.props.label]: '',
        [this.activeData.props.props.value]: ''
      })
    },
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
