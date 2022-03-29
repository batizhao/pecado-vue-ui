<template>
  <div v-if="activeData.eventSettings">
    <el-divider>事件</el-divider>
      <el-form-item label="事件动作">
        <el-select v-model="activeData.eventSettings.emit">
          <el-option value="buttonEmitSubmit" label="提交"></el-option>
          <el-option value="buttonEmitSave" label="保存"></el-option>
          <el-option value="buttonEmitReset" label="重置"></el-option>
        </el-select>
      </el-form-item>
  </div>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data () {
    return {
    }
  }
}
</script>
