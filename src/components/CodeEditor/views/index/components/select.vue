<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
      <el-form-item label="能否清空">
        <el-switch v-model="activeData.clearable" />
      </el-form-item>
      <el-form-item label="能否搜索">
        <el-switch v-model="activeData.filterable" />
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch v-model="activeData.disabled" />
      </el-form-item>
      <el-form-item label="是否多选">
        <el-switch v-model="activeData.multiple" :disabled="activeData.assemblyStatus" />
      </el-form-item>
      <el-form-item label="占位提示">
        <el-input
          v-model="activeData.placeholder"
          placeholder="请输入占位提示"
        />
      </el-form-item>
      <options></options>
      </form-basic-setting>
    </el-form>
  </div>
</template>

<script>
import formBasicSetting from './formBasicSetting.vue'
import options from './options/index.vue'
import mixins from './mixins'
export default {
  components: {
    options,
    formBasicSetting
  },
  mixins: [mixins],
  methods: {
  }
}
</script>
