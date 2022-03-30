<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting></form-basic-setting>
      <function-setting></function-setting>
      <el-form-item v-if="activeData.type === 'password'" label="显示密码">
        <el-switch v-model="activeData['show-password']" />
      </el-form-item>
      <el-form-item label="输入统计">
        <el-switch v-model="activeData['show-word-limit']" />
      </el-form-item>
      <el-form-item v-if="activeData.type === 'text'" label="能否清空">
        <el-switch v-model="activeData.clearable" />
      </el-form-item>
      <el-form-item label="是否只读">
        <el-switch v-model="activeData.readonly" />
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch v-model="activeData.disabled" />
      </el-form-item>

      <el-form-item label="占位提示">
        <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" clearable />
      </el-form-item>
      <template v-if="activeData.type === 'text' || activeData.type === 'password'">
        <el-form-item label="前缀">
          <el-input v-model="activeData.__slot__.prepend" placeholder="请输入前缀" />
        </el-form-item>
        <el-form-item label="后缀">
          <el-input v-model="activeData.__slot__.append" placeholder="请输入后缀" />
        </el-form-item>
        <el-form-item label="前图标">
          <el-input v-model="activeData['prefix-icon']" placeholder="请输入前图标名称">
            <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
              选择
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="后图标">
          <el-input v-model="activeData['suffix-icon']" placeholder="请输入后图标名称">
            <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
              选择
            </el-button>
          </el-input>
        </el-form-item>
      </template>
      <template v-if="activeData.type === 'textarea'">
        <el-form-item label="最小行数">
          <el-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="最小行数" />
        </el-form-item>
        <el-form-item label="最大行数">
          <el-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="最大行数" />
        </el-form-item>
      </template>
      <el-form-item label="最多输入">
        <el-input v-model="activeData.maxlength" placeholder="请输入字符长度">
          <template slot="append">
            个字符
          </template>
        </el-input>
      </el-form-item>
      <regular v-if="activeData.__config__.regList"></regular>
    </el-form>
    <icons-dialog
      :visible.sync="iconsVisible"
      :current="activeData[currentIconModel]"
      @select="setIcon"
    />
  </div>
</template>

<script>
import regular from './regular.vue'

import IconsDialog from './IconsDialog'
import mixins from './mixins'
import formBasicSetting from './formBasicSetting.vue'
import functionSetting from './functionSetting.vue'
export default {
  name: 'lx-input',
  components: {
    IconsDialog,
    regular,
    formBasicSetting,
    functionSetting
  },
  mixins: [mixins],
  data () {
    return {
      iconsVisible: false,
      currentIconModel: null,
      componentType: ''
    }
  },

  methods: {

    openIconsDialog (model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon (val) {
      this.activeData[this.currentIconModel] = val
    }
  }
}
</script>
