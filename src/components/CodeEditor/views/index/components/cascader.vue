<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting></form-basic-setting>
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
        <el-switch v-model="activeData.props.props.multiple" :disabled="activeData.assemblyStatus"/>
      </el-form-item>
      <el-form-item label="任选层级">
        <el-switch v-model="activeData.props.props.checkStrictly" />
      </el-form-item>
      <el-form-item label="展示全路径">
        <el-switch v-model="activeData['show-all-levels']" />
      </el-form-item>
      <el-form-item label="占位提示">
        <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
      </el-form-item>
      <el-form-item label="选项分隔符">
        <el-input v-model="activeData.separator" placeholder="请输入选项分隔符" />
      </el-form-item>
      <options></options>
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
  mixins: [mixins]
}
</script>
