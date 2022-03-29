<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting></form-basic-setting>
      <el-form-item label="是否禁用">
        <el-switch v-model="activeData.disabled" />
      </el-form-item>
      <el-form-item label="按钮图标">
        <el-input v-model="activeData['icon']" placeholder="请输入按钮图标名称">
          <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('icon')">
            选择
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="按钮类型">
        <el-select v-model="activeData.type">
          <el-option label="default" value="default" />
          <el-option label="primary" value="primary" />
          <el-option label="success" value="success" />
          <el-option label="warning" value="warning" />
          <el-option label="danger" value="danger" />
          <el-option label="info" value="info" />
          <el-option label="text" value="text" />
        </el-select>
      </el-form-item>
      <el-form-item label="按钮文字">
        <el-input v-model="activeData.__slot__.default" @input="changeRenderKey" placeholder="请输入按钮文字" />
      </el-form-item>
      <click-event></click-event>
    </el-form>
    <icons-dialog
      :visible.sync="iconsVisible"
      :current="activeData[currentIconModel]"
      @select="setIcon"
    />
  </div>
</template>

<script>
import formBasicSetting from './formBasicSetting.vue'
import mixins from './mixins'
import IconsDialog from './IconsDialog'
import clickEvent from './clickEvent.vue'
import { mapMutations } from 'vuex'
export default {
  components: {
    formBasicSetting,
    IconsDialog,
    clickEvent
  },
  mixins: [mixins],
  data () {
    return {
      iconsVisible: false,
      currentIconModel: null,
      currentEvent: '',
      tableOptions: []
    }
  },
  methods: {
    openIconsDialog (model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon (val) {
      this.activeData[this.currentIconModel] = val
    },
    ...mapMutations('codeEditor/components', ['changeRenderKey'])
  }
}
</script>
