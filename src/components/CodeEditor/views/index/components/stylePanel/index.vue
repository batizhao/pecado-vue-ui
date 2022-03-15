<template>
  <div class="component-style-panel" v-if="activeData && activeData.__config__">
    <el-form size="small" label-width="70px">
      <el-form-item
        v-if="activeData.__config__.span !== undefined"
        label="栅格"
        style="padding-right: 20px;margin-bottom: 40px;"
      >
        <el-slider
          v-model="activeData.__config__.span"
          :max="24"
          :min="0"
          :marks="{0: 'auto', 6: '25%', 12: '50%', 18: '75%', 24: '100%' }"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="styleStatus">
          <el-option value="default" label="默认状态"></el-option>
          <el-option value="hover" label="鼠标悬浮"></el-option>
          <el-option value="active" label="鼠标按下"></el-option>
          <el-option value="focus" label="聚集焦点"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="-1">
        <template slot="title">
          <div class="panel-title">
            组件高
            <unit-input style="width: 74%;" v-model="currentStatusStyle.height"></unit-input>
          </div>
        </template>
        <el-form size="small" label-width="70px">
          <el-form-item label="最大高度">
            <unit-input v-model="currentStatusStyle.maxHeight"></unit-input>
          </el-form-item>
          <el-form-item label="最小高度">
            <unit-input v-model="currentStatusStyle.minHeight"></unit-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="0">
        <template slot="title">
          <div class="panel-title">
            组件宽
            <unit-input style="width: 74%;" v-model="currentStatusStyle.width"></unit-input>
          </div>
        </template>
        <el-form size="small" label-width="70px">
          <el-form-item label="最大宽度">
            <unit-input v-model="currentStatusStyle.maxWidth"></unit-input>
          </el-form-item>
          <el-form-item label="最小宽度">
            <unit-input v-model="currentStatusStyle.minWidth"></unit-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="1">
        <template slot="title">
          <div class="panel-title">
            Margin
            <unit-input style="width: 74%;" v-model="margin"></unit-input>
          </div>
        </template>
        <el-form size="small" label-width="60px">
          <el-form-item label="上间距">
            <unit-input v-model="currentStatusStyle.marginTop"></unit-input>
          </el-form-item>
          <el-form-item label="右间距">
            <unit-input v-model="currentStatusStyle.marginRight"></unit-input>
          </el-form-item>
          <el-form-item label="下间距">
            <unit-input v-model="currentStatusStyle.marginBottom"></unit-input>
          </el-form-item>
          <el-form-item label="左间距">
            <unit-input v-model="currentStatusStyle.marginLeft"></unit-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="panel-title">
            Padding
            <unit-input style="width: 74%;" v-model="padding"></unit-input>
          </div>
        </template>
        <el-form size="small" label-width="60px">
          <el-form-item label="上间距">
            <unit-input v-model="currentStatusStyle.paddingTop"></unit-input>
          </el-form-item>
          <el-form-item label="右间距">
            <unit-input v-model="currentStatusStyle.paddingRight"></unit-input>
          </el-form-item>
          <el-form-item label="下间距">
            <unit-input v-model="currentStatusStyle.paddingBottom"></unit-input>
          </el-form-item>
          <el-form-item label="左间距">
            <unit-input v-model="currentStatusStyle.paddingLeft"></unit-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <div class="panel-title">
            Display
            <el-radio-group v-model="currentStatusStyle.display" size="mini">
              <el-radio-button label="block"></el-radio-button>
              <el-radio-button label="inline"></el-radio-button>
              <el-radio-button label="inline-block"></el-radio-button>
              <el-radio-button label="flex"></el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <el-form size="small" label-width="101px" v-show="currentStatusStyle.display === 'flex'">
          <el-form-item label="flex-direction">
            <el-select v-model="currentStatusStyle.flexDirection">
              <el-option value="row"></el-option>
              <el-option value="column"></el-option>
              <el-option value="row-reverse"></el-option>
              <el-option value="column-reverse"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="justify-content">
            <el-select v-model="currentStatusStyle.justifyContent">
              <el-option value="flex-start"></el-option>
              <el-option value="flex-end"></el-option>
              <el-option value="center"></el-option>
              <el-option value="space-around"></el-option>
              <el-option value="space-between"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="align-items">
            <el-select v-model="currentStatusStyle.alignItems">
              <el-option value="flex-start"></el-option>
              <el-option value="flex-end"></el-option>
              <el-option value="center"></el-option>
              <el-option value="stretch"></el-option>
              <el-option value="baseline"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="4">
        <template slot="title">
          <div class="panel-title">
            文字
          </div>
        </template>
        <el-form size="small" label-width="42px">
          <el-form-item label="大小">
            <unit-input v-model="currentStatusStyle.fontSize" :unitList="['px', 'em', 'rem']"></unit-input>
          </el-form-item>
          <el-form-item label="行高">
            <unit-input v-model="currentStatusStyle.lineHeight" :unitList="['px', 'em', 'rem']"></unit-input>
          </el-form-item>
          <el-form-item label="粗细">
            <el-radio-group v-model="currentStatusStyle.fontWeight" size="mini">
              <el-radio-button label="normal"></el-radio-button>
              <el-radio-button label="lighter"></el-radio-button>
              <el-radio-button label="bolder"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="样式">
            <el-radio-group v-model="currentStatusStyle.fontStyle" size="mini">
              <el-radio-button label="normal"></el-radio-button>
              <el-radio-button label="italic"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="对齐">
            <el-radio-group v-model="currentStatusStyle.textAlign" size="mini">
              <el-radio-button label="left"></el-radio-button>
              <el-radio-button label="center"></el-radio-button>
              <el-radio-button label="right"></el-radio-button>
              <el-radio-button label="justify"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="修饰">
            <el-radio-group v-model="currentStatusStyle.textDecoration" size="mini">
              <el-radio-button label="none"></el-radio-button>
              <el-radio-button label="underline"></el-radio-button>
              <el-radio-button label="line-through"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker v-model="currentStatusStyle.color"></el-color-picker>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template slot="title">
          <div class="panel-title">
            背景
          </div>
        </template>
         <el-form size="small" label-width="55px">
          <el-form-item label="背景色">
            <el-color-picker v-model="currentStatusStyle.backgroundColor"></el-color-picker>
          </el-form-item>
          <el-form-item label="背景图">
            <el-input v-model="backgroundImage"></el-input>
          </el-form-item>
          <div v-show="currentStatusStyle.backgroundImage">
            <el-form-item label="位置">
              <el-select v-model="backgroundPosition">
                <el-option label="left top" value="0% 0%"></el-option>
                <el-option label="center top" value="50% 0%"></el-option>
                <el-option label="right top" value="100% 0%"></el-option>
                <el-option label="left center" value="0% 50%"></el-option>
                <el-option label="center" value="50% 50%"></el-option>
                <el-option label="right center" value="100% 50%"></el-option>
                <el-option label="left bottom" value="0% 100%"></el-option>
                <el-option label="center bottom" value="50% 100%"></el-option>
                <el-option label="right bottom" value="100% 100%"></el-option>
              </el-select>
              <unit-input v-model="currentStatusStyle.backgroundPositionX" defaultUnitValue="%" placeholder="X 轴"></unit-input>
              <unit-input v-model="currentStatusStyle.backgroundPositionY" defaultUnitValue="%" placeholder="Y 轴"></unit-input>
            </el-form-item>
            <el-form-item label="大小">
              <el-select v-model="backgroundSize">
                <el-option label="cover" value="cover"></el-option>
                <el-option label="contain" value="contain"></el-option>
                <el-option label="自定义" value="custom"></el-option>
              </el-select>
              <div v-show="backgroundSize === 'custom'">
                <unit-input v-model="currentStatusStyle.backgroundSizeX" placeholder="X 轴"></unit-input>
                <unit-input v-model="currentStatusStyle.backgroundSizeY" placeholder="Y 轴"></unit-input>
              </div>
            </el-form-item>
            <el-form-item label="重复">
              <el-select v-model="currentStatusStyle.backgroundRepeat">
                <el-option value="no-repeat"></el-option>
                <el-option value="repeat"></el-option>
                <el-option value="repeat-x"></el-option>
                <el-option value="repeat-y"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="固定">
              <el-radio-group v-model="currentStatusStyle.backgroundAttachment" size="mini">
                <el-radio-button label="fixed"></el-radio-button>
                <el-radio-button label="scroll"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
         </el-form>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template slot="title">
          <div class="panel-title">
            边框
          </div>
        </template>
        <el-form size="small" label-width="70px">
          <el-form-item label="边框">
            <el-select v-model="borderDirection">
              <el-option label="全部" value="border"></el-option>
              <el-option label="上边框" value="borderTop"></el-option>
              <el-option label="右边框" value="borderRight"></el-option>
              <el-option label="下边框" value="borderBottom"></el-option>
              <el-option label="左边框" value="borderLeft"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="样式">
            <el-select v-model="currentStatusStyle[borderDirection + 'Style']">
              <el-option value="none"></el-option>
              <el-option value="solid"></el-option>
              <el-option value="dotted"></el-option>
              <el-option value="dashed"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="宽度">
            <unit-input v-model="currentStatusStyle[borderDirection + 'Width']" :unitList="['px']"></unit-input>
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker v-model="currentStatusStyle[borderDirection + 'Color']"></el-color-picker>
          </el-form-item>
          <el-form-item label="圆角">
            <el-select v-model="borderRadiusDirection">
              <el-option label="全部" value="border"></el-option>
              <el-option label="左上角" value="borderTopLeft"></el-option>
              <el-option label="右上角" value="borderTopRight"></el-option>
              <el-option label="右下角" value="borderBottomRight"></el-option>
              <el-option label="左下角" value="borderBottomLeft"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="圆角大小">
            <unit-input v-model="currentStatusStyle[borderRadiusDirection + 'Radius']" :unitList="['px']"></unit-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="6">
        <template slot="title">
          <div class="panel-title">
            阴影
          </div>
        </template>
        <box-shadow v-model="currentStatusStyle.boxShadow"></box-shadow>
      </el-collapse-item>
      <el-collapse-item name="7">
        <template slot="title">
          <div class="panel-title opacity-panel-title">
            不透明度
            <unit-input style="width: 74%;" v-model="currentStatusStyle.opacity" defaultUnitValue="%" :unitList="['%']" :max="100"></unit-input>
          </div>
        </template>
      </el-collapse-item>
      <el-collapse-item name="8">
        <template slot="title">
          <div class="panel-title cursor-panel-title">
            鼠标手势
            <el-select v-model="currentStatusStyle.cursor" size="small" style="width: 74%;">
              <el-option value="default"></el-option>
              <el-option value="pointer"></el-option>
              <el-option value="text"></el-option>
              <el-option value="help"></el-option>
            </el-select>
          </div>
        </template>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import BoxShadow from './boxShadow.vue'
import unitInput from './unitInput.vue'
import { addOneNodeStyleToDocument, addAllNodesStyleToDocument } from '@/components/CodeEditor/components/parser/addStyleToDocument.js'
import _ from 'lodash'
export default {
  components: {
    unitInput,
    BoxShadow
  },
  props: {
    activeData: Object,
    drawingList: Array
  },
  data () {
    return {
      activeNames: [],
      styleStatus: 'default', // 当前状态
      defaultStyles: {}, // 节点样式表
      hoverStyles: {}, // hover样式表
      activeStyles: {}, // active样式表
      focusStyles: {}, // focus样式表

      borderDirection: 'border',
      borderRadiusDirection: 'border',
      initDown: true
    }
  },
  computed: {
    currentStatusStyle: { // 当前状态的样式表
      get () {
        return this.$data[this.styleStatus + 'Styles']
      },
      set (val) {
        this.$data[this.styleStatus + 'Styles'] = val
      }
    },
    backgroundPosition: {
      get () {
        if (this.currentStatusStyle.backgroundPositionX && this.currentStatusStyle.backgroundPositionY) {
          return this.currentStatusStyle.backgroundPositionX + ' ' + this.currentStatusStyle.backgroundPositionY
        }
        return ''
      },
      set (val) {
        const arr = val.split(' ')
        this.$set(this.currentStatusStyle, 'backgroundPositionX', arr[0])
        this.$set(this.currentStatusStyle, 'backgroundPositionY', arr[1])
      }
    },
    backgroundSize: {
      get () {
        return this.currentStatusStyle.backgroundSize || 'custom'
      },
      set (val) {
        if (['contain', 'cover'].includes(val)) {
          this.$set(this.currentStatusStyle, 'backgroundSizeX', undefined)
          this.$set(this.currentStatusStyle, 'backgroundSizeY', undefined)
          this.$set(this.currentStatusStyle, 'backgroundSize', val)
        } else if (val === 'custom') {
          this.$set(this.currentStatusStyle, 'backgroundSize', undefined)
        }
      }
    },
    backgroundImage: {
      get () {
        return this.currentStatusStyle.backgroundImage && this.currentStatusStyle.backgroundImage.match(/url\((.+)\)/)[1]
      },
      set (val) {
        this.$set(this.currentStatusStyle, 'backgroundImage', `url(${val})`)
      }
    },
    margin: {
      get () {
        const { marginTop, marginBottom, marginLeft, marginRight } = this.currentStatusStyle
        return (marginTop === marginBottom && marginTop === marginLeft && marginTop === marginRight) ? marginTop : ''
      },
      set (val) {
        this.setFourDirectionValue('margin', val)
      }
    },
    padding: {
      get () {
        const { paddingTop, paddingBottom, paddingLeft, paddingRight } = this.currentStatusStyle
        return (paddingTop === paddingBottom && paddingTop === paddingLeft && paddingTop === paddingRight) ? paddingTop : ''
      },
      set (val) {
        this.setFourDirectionValue('padding', val)
      }
    }
  },
  created () {
    addAllNodesStyleToDocument(this.drawingList || [])
  },
  watch: {
    // 监听组件切换
    activeData () {
      this.styleStatus = 'default'
      const styles = this.activeData && (this.activeData.styles || {})
      this.defaultStyles = styles.defaultStyles || {}
      this.hoverStyles = styles.hoverStyles || {}
      this.activeStyles = styles.activeStyles || {}
      this.focusStyles = styles.focusStyles || {}
    },
    drawingList (val) {
      addAllNodesStyleToDocument(this.drawingList || [])
    },
    currentStatusStyle: {
      handler (val) {
        if (!this.activeData.styles) {
          this.$set(this.activeData, 'styles', {})
        }
        this.$set(this.activeData.styles, this.styleStatus + 'Styles', val)
        this._addStyleToDocument()
      },
      deep: true
    },
    borderDirection (val) {
      for (const key in this.currentStatusStyle) {
        if (
          (val === 'border' && /border(Top|Right|Bottom|Left)(Style|Width|Color)/.test(key)) ||
          (val !== 'border' && /border(Style|Width|Color)/.test(key))
        ) {
          this.$set(this.currentStatusStyle, key, undefined)
        }
      }
    },
    borderRadiusDirection (val) {
      for (const key in this.currentStatusStyle) {
        if (
          (val === 'border' && /border(Top|Bottom)(Left|Right)Radius/.test(key)) ||
          (val !== 'border' && key === 'borderRadius')
        ) {
          this.$set(this.currentStatusStyle, key, undefined)
        }
      }
    }
  },
  methods: {
    setFourDirectionValue (attr, val) {
      [attr + 'Top', attr + 'Right', attr + 'Bottom', attr + 'Left'].forEach(key => {
        this.$set(this.currentStatusStyle, key, val)
      })
    },
    _addStyleToDocument: _.debounce(function () {
      addOneNodeStyleToDocument(this.activeData)
    }, 500)
  }
}
</script>
<style lang="scss">
.component-style-panel {
  .el-collapse-item__header {
    height: 62px;
  }
  .el-collapse-item__content {
    width: 82%;
    margin-right: 33px;
  }
  .el-collapse-item__wrap {
    display: flex;
    justify-content: flex-end;
  }
  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px;
  }
  .opacity-panel-title, .cursor-panel-title{
    & + i {
      display: none;
    }
    cursor: default;
  }
}
</style>
<style scoped>
.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 13px;
  width: 100%;
  color: #606266;
  font-size: 14px;
}
</style>
