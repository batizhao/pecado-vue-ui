<template>
  <action-dialog
    v-model="addUseDialog"
    title="添加到常用应用"
    @confirm="addUseConfirm"
  >
  <el-form size="small" label-width="90px">
      <el-form-item label="应用图标">
        <el-input v-model="commonUseInfo.icon" placeholder="请输入图标名称">
          <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('icon')">
            选择
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="应用名称">
        <el-input v-model="commonUseInfo.name"  placeholder="请输入应用名称" />
      </el-form-item>
      <el-form-item label="应用路径">
        <el-input v-model="commonUseInfo.url"  placeholder="请输入应用路径" />
      </el-form-item>
    </el-form>
    <icons-dialog
      :visible.sync="iconsVisible"
      :current="currentIconModel"
      @select="setIcon"
    />
  </action-dialog>
</template>

<script>
import { } from '@/api/oa/process.js'
import mixins from '../../views/index/components/mixins'
import IconsDialog from '../../views/index/components/IconsDialog'
export default {
    components: {
    IconsDialog,
  },
  mixins: [mixins],
  data () {
    return {
        iconsVisible: false,
        currentIconModel: '',
        addUseDialog:false,
        loading:false,
        commonUseInfo:{
            icon:'',
            name:'',
            url:''
        }
    }
  },
  methods: {
      openIconsDialog (model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    // 打开添加常用应用弹窗
    open (url) {
        this.addUseDialog=true
        this.commonUseInfo.url=url
    },
    // 提交
    addUseConfirm () {
         this.addUseDialog=false
    },
    setIcon (val) {
      this.commonUseInfo.icon = val
    },
  }
}
</script>
