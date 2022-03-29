<template>
  <div>
    <el-form size="small" label-width="90px">
      <el-form-item label="组件名">
        <el-input v-model="activeData.__config__.componentName" placeholder="组件名" />
      </el-form-item>
      <template v-if="activeData.__config__.layoutTree">
        <el-divider>布局结构树</el-divider>
        <el-tree
          :data="[activeData.__config__]"
          :props="layoutTreeProps"
          node-key="renderKey"
          default-expand-all
          draggable
        >
          <span slot-scope="{ node, data }">
            <span class="node-label">
              <svg-icon
                class="node-icon"
                :icon-class="data.__config__ ? data.__config__.tagIcon : data.tagIcon"
              />
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </template>
    </el-form>
  </div>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data () {
    return {
      layoutTreeProps: {
        label (data) {
          const config = data.__config__
          return `${data.label || config.label}: ${data.componentName || data.__vModel__}`
        }
      }
    }
  }
}
</script>
