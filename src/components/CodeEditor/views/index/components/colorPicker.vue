<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
      <el-form-item v-if="activeData.disabled !== undefined" label="是否禁用">
        <el-switch v-model="activeData.disabled" />
      </el-form-item>
      <el-form-item label="组件尺寸">
        <el-radio-group v-model="activeData.size">
          <el-radio-button label="medium">
            中等
          </el-radio-button>
          <el-radio-button label="small">
            较小
          </el-radio-button>
          <el-radio-button label="mini">
            迷你
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="颜色格式">
        <el-select
          v-model="activeData['color-format']"
          placeholder="请选择颜色格式"
          :style="{ width: '100%' }"
          clearable
          @change="colorFormatChange"
        >
          <el-option
            v-for="(item, index) in colorFormatOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="默认值">
				<el-input
					:value="setDefaultValue(activeData.__config__.defaultValue)"
					placeholder="请输入默认值"
					clearable
					@input="onDefaultValueInput"
				/>
			</el-form-item>
      </form-basic-setting>
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
  data () {
    return {
      colorFormatOptions: [
        {
          label: 'hex',
          value: 'hex'
        },
        {
          label: 'rgb',
          value: 'rgb'
        },
        {
          label: 'rgba',
          value: 'rgba'
        },
        {
          label: 'hsv',
          value: 'hsv'
        },
        {
          label: 'hsl',
          value: 'hsl'
        }
      ]
    }
  },
  methods: {
    setDefaultValue,
    onDefaultValueInput,
    colorFormatChange (val) {
      this.activeData.__config__.defaultValue = null
      this.activeData['show-alpha'] = val.indexOf('a') > -1
      this.activeData.__config__.renderKey = +new Date() // 更新renderKey,重新渲染该组件
    }
  }
}
</script>
