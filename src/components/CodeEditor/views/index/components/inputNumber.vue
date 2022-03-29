<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting></form-basic-setting>
      <el-form-item label="默认值">
        <el-input-number
          :value="setDefaultValue(activeData.__config__.defaultValue)"
          placeholder="请输入默认值"
          @input="onDefaultValueInput"
          clearable
        />
      </el-form-item>
      <el-form-item label="最小值">
        <el-input-number v-model="activeData.min" placeholder="最小值" />
      </el-form-item>
      <el-form-item label="最大值">
        <el-input-number v-model="activeData.max" placeholder="最大值" />
      </el-form-item>
      <el-form-item label="精度">
        <el-input-number v-model="activeData.precision" :min="0" placeholder="精度" />
      </el-form-item>
      <el-form-item label="步数">
        <el-input-number v-model="activeData.step" placeholder="步数" />
      </el-form-item>
      <el-form-item label="严格步数">
        <el-switch v-model="activeData['step-strictly']" />
      </el-form-item>
      <el-form-item label="按钮位置">
        <el-radio-group v-model="activeData['controls-position']">
          <el-radio-button label="">
            默认
          </el-radio-button>
          <el-radio-button label="right">
            右侧
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import formBasicSetting from './formBasicSetting.vue'
import mixins from './mixins'
import { setDefaultValue, onDefaultValueInput } from './utils'
export default {
  components: {
    formBasicSetting
  },
  mixins: [mixins],
  methods: {
    setDefaultValue,
    onDefaultValueInput
  }
}
</script>
