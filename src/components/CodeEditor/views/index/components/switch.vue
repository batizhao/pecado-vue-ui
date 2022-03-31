<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
      <el-form-item label="开启颜色">
        <el-color-picker v-model="activeData['active-color']" />
      </el-form-item>
      <el-form-item label="关闭颜色">
        <el-color-picker v-model="activeData['inactive-color']" />
      </el-form-item>
      <el-form-item label="开启提示">
        <el-input
          v-model="activeData['active-text']"
          placeholder="请输入开启提示"
          @change="handleActiveChange"
        />
      </el-form-item>
      <el-form-item label="关闭提示">
        <el-input
          v-model="activeData['inactive-text']"
          placeholder="请输入关闭提示"
          @change="handleInactiveChange"
        />
      </el-form-item>
      </form-basic-setting>
    </el-form>
  </div>
</template>
<script>
import formBasicSetting from './formBasicSetting.vue'
import mixins from './mixins'
export default {
  props: {
    value: {
      type: Object
    }
  },
  mixins: [mixins],
  data() {
    return {
      currentTab: 'field'
    }
  },
  methods: {
    handleActiveChange(val) {
      this.activeData['active-value'] = val || '开'
    },
    handleInactiveChange(val) {
      this.activeData['inactive-value'] = val || '关'
    },
  },
  components: {
    formBasicSetting
  }
}
</script>
