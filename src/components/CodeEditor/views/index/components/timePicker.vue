<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
      <el-form-item label="能否清空">
        <el-switch v-model="activeData.clearable" />
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch v-model="activeData.disabled" />
      </el-form-item>
      <el-form-item label="时间段" v-if="!activeData['is-range']">
        <el-input
          v-model="activeData['picker-options'].selectableRange"
          placeholder="请输入时间段"
        />
      </el-form-item>
      <el-form-item label="时间格式">
        <el-input
          :value="activeData.format"
          placeholder="请输入时间格式"
          disabled
        />
      </el-form-item>
      <template v-if="activeData['is-range']">
        <el-form-item label="开始占位">
          <el-input v-model="activeData['start-placeholder']" placeholder="请输入占位提示" />
        </el-form-item>
        <el-form-item label="结束占位">
          <el-input v-model="activeData['end-placeholder']" placeholder="请输入占位提示" />
        </el-form-item>
        <el-form-item  label="分隔符">
          <el-input v-model="activeData['range-separator']" placeholder="请输入分隔符" />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="占位提示">
          <el-input v-model="activeData.placeholder" placeholder="请输入占位提示"/>
        </el-form-item>
      </template>
      </form-basic-setting>
    </el-form>
  </div>
</template>

<script>
import mixins from './mixins'
import formBasicSetting from './formBasicSetting.vue'
export default {
  components: {
    formBasicSetting
  },
  mixins: [mixins],
  methods: {
  }
}
</script>
