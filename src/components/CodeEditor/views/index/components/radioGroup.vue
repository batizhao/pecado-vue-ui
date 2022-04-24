<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
      <el-form-item label="选项样式">
        <el-radio-group v-model="activeData.__config__.optionType">
          <el-radio-button label="default">
            默认
          </el-radio-button>
          <el-radio-button label="button">
            按钮
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否带边框" v-show="activeData.__config__.optionType === 'default'">
        <el-switch v-model="activeData.__config__.border" />
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch v-model="activeData.disabled" />
      </el-form-item>
      <template v-if="activeData.__config__.tag === 'el-checkbox-group'">
        <el-form-item label="至少应选">
          <el-input-number v-model="activeData.min" />
        </el-form-item>
        <el-form-item label="最多可选">
          <el-input-number v-model="activeData.max" />
        </el-form-item>
      </template>
      </form-basic-setting>
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
