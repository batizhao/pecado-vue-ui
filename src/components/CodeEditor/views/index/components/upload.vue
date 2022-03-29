<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting></form-basic-setting>
      <el-form-item label="显示提示">
        <el-switch v-model="activeData.__config__.showTip" />
      </el-form-item>
      <el-form-item label="多选文件">
        <el-switch v-model="activeData.multiple" />
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch v-model="activeData.disabled" />
      </el-form-item>
      <!-- <el-form-item label="文件字段名">
        <el-input v-model="activeData.name" placeholder="请输入上传文件字段名" />
      </el-form-item> -->
      <el-form-item label="文件类型">
        <el-select v-model="activeData.accept" placeholder="请选择文件类型" clearable>
          <el-option
            v-for="(item, index) in imageTypes"
            :key="index"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上传个数">
        <el-input-number v-model="activeData.limit"></el-input-number>
      </el-form-item>
      <el-form-item label="文件大小">
        <el-input v-model.number="activeData.__config__.fileSize" placeholder="请输入文件大小">
          <span slot="append">MB</span>
        </el-input>
      </el-form-item>
      <el-form-item label="上传地址">
        <el-input v-model="activeData.action" placeholder="请输入上传地址" clearable />
      </el-form-item>
      <el-form-item label="列表类型">
        <el-radio-group v-model="activeData['list-type']" size="small" @change="changeRenderKey">
          <el-radio-button label="text">
            text
          </el-radio-button>
          <el-radio-button label="picture">
            picture
          </el-radio-button>
          <el-radio-button label="picture-card">
            picture-card
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="'picture-card' !== activeData['list-type']" label="按钮文字">
        <el-input v-model="activeData.__config__.buttonText" placeholder="请输入按钮文字"  @input="changeRenderKey" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import formBasicSetting from './formBasicSetting.vue'
import mixins from './mixins'
import { getEnumArray } from '@/components/CodeEditor/dictionary/index.js'
import { mapMutations } from 'vuex'
export default {
  components: {
    formBasicSetting
  },
  mixins: [mixins],
  data () {
    return {
      imageTypes: getEnumArray('imageType')
    }
  },
  methods: {
    ...mapMutations('codeEditor/components', ['changeRenderKey'])
  }
}
</script>
