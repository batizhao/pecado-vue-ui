<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="样式" name="style" />
      <el-tab-pane label="表单属性" name="form" v-if="formConf.isForm"/>
    </el-tabs>
    <div class="field-box">
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <div v-show="currentTab==='field' && showField">
          <component :is="currentComponent"/>
        </div>

        <!-- 样式面板 -->
        <div v-show="currentTab==='style'">
          <style-panel></style-panel>
        </div>

        <!-- 表单属性 -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <el-form-item label="表单名">
            <el-input v-model="formConf.formRef" placeholder="包含字母和下划线，长度不超过30" />
          </el-form-item>
          <!-- <el-form-item label="表单模型">
            <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
          </el-form-item>
          <el-form-item label="校验模型">
            <el-input v-model="formConf.formRules" placeholder="请输入校验模型" />
          </el-form-item> -->
          <el-form-item label="表单尺寸" v-if="formConf.size !== undefined">
            <el-radio-group v-model="formConf.size">
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
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">
                左对齐
              </el-radio-button>
              <el-radio-button label="right">
                右对齐
              </el-radio-button>
              <el-radio-button label="top">
                顶部对齐
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input-number v-model="formConf.labelWidth" :min="0" :max="1000" :step="25"></el-input-number>
          </el-form-item>
          <el-form-item label="栅格间隔">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
          </el-form-item>
          <el-form-item label="禁用表单" v-if="formConf.disabled !== undefined">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="表单按钮" v-if="formConf.formBtns !== undefined">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <!-- <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
    -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import stylePanel from './components/stylePanel/index.vue'
import LxInput from './components/input.vue'
import LxSelect from './components/select.vue'
import LxScore from './components/score.vue'
import LxCascader from './components/cascader.vue'
import LxRadioGroup from './components/radioGroup.vue'
import LxInputNumber from './components/inputNumber.vue'
import LxSwitch from './components/switch.vue'
import LxTinymce from './components/tinymce.vue'
import LxSlider from './components/slider.vue'
import LxTimePicker from './components/timePicker.vue'
import LxDatePicker from './components/datePicker.vue'
import LxRow from './components/row.vue'
import LxButton from './components/button.vue'
import LxColorPicker from './components/colorPicker.vue'
import LxUpload from './components/upload.vue'
import lxMyBacklog from './components/myBacklog.vue'
import LxHtmlInterpreter from './components/htmlInterpreter.vue'
import LxDepartmentSelector from './components/departmentSelector.vue'
import LxDepartmentSelector2 from './components/departmentSelector2.vue'
import LxPageContainer from './components/pageContainer.vue'
import LxNavBar from './components/navBar.vue'
import LxLayoutTable from './components/layoutTable/index.vue'
import LxLoginLog from './components/loginLog.vue'
import LxSubformTable from './components/subformTable/index.vue'
import LxBreadcrumb from './components/breadcrumb.vue'
import LxCommonUse from './components/commonUse.vue'

export default {
  components: {
    stylePanel,
    LxInput,
    LxSelect,
    LxScore,
    LxCascader,
    LxRadioGroup,
    LxSlider,
    LxInputNumber,
    LxSwitch,
    LxTimePicker,
    LxDatePicker,
    LxTinymce,
    LxRow,
    LxButton,
    LxColorPicker,
    LxUpload,
    lxMyBacklog,
    LxHtmlInterpreter,
    LxDepartmentSelector,
    LxDepartmentSelector2,
    LxPageContainer,
    LxNavBar,
    LxLayoutTable,
    LxLoginLog,
    LxSubformTable,
    LxBreadcrumb,
    LxCommonUse,
  },
  props: ['showField'],
  data () {
    return {
      currentTab: 'field',
      currentNode: null

    }
  },
  computed: {
    ...mapState('codeEditor/components', ['formData', 'activeIndex', 'drawingList']),
    formConf: {
      get () {
        return this.$store.state.codeEditor.components.formConf
      }
    },
    currentComponent () {
      const currentComponent = this.$store.getters['codeEditor/components/getCurrentComponent']
      if (currentComponent && this.activeIndex.length > 0 && this.drawingList.length > 0) {
        return currentComponent.__config__.panel
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss">
.right-board {
  .right-scrollbar {
    .el-scrollbar__view {
      padding: 12px 18px 15px 15px;
    }
  }
  .el-scrollbar__wrap {
    box-sizing: border-box;
    overflow-x: hidden !important;
    margin-bottom: 0 !important;
  }
  .center-tabs{
    .el-tabs__header{
      margin-bottom: 0!important;
    }
    .el-tabs__item{
      width: 33.3%;
      text-align: center;
    }
    .el-tabs__nav{
      width: 100%;
    }
  }
  .el-scrollbar {
    height: 100%;
  }
}
</style>
<style lang="scss" scoped>
.right-board {
  padding-top: 3px;
  width: 360px;
  .field-box {
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    height: calc(100vh - 97px);
  }
}
.select-item {
  display: flex;
  box-sizing: border-box;
  border: 1px dashed #fff;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  padding: 0 4px;
  line-height: 32px;
  font-size: 22px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  border-radius: 0 0 6px 0;
  width: 26px;
  height: 26px;
  background: #409eff;
  cursor: pointer;
  line-height: 26px;
  text-align: center;
  font-size: 18px;
  color: #fff;
}
.node-label {
  font-size: 14px;
}
.node-icon {
  color: #bebfc3;
}
</style>
