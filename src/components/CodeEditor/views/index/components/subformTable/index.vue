<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
        <el-form-item label="复选框">
          <el-switch v-model="activeData.showSelection" />
        </el-form-item>
        <el-form-item label="序号">
          <el-switch v-model="activeData.showOrderNumber" />
        </el-form-item>
        <el-form-item label="操作列">
          <el-switch v-model="activeData.operationColumn.show" />
        </el-form-item>
        <template v-if="activeData.operationColumn.show">
          <el-form-item label="可移动">
            <el-switch v-model="activeData.operationColumn.movable" />
          </el-form-item>
          <el-form-item label="操作列宽度">
            <el-input-number v-model="activeData.operationColumn.width" :min="1" />
          </el-form-item>
          <el-form-item label="操作列固定">
            <el-select v-model="activeData.operationColumn.fixed">
              <el-option label="不固定" :value="false"></el-option>
              <el-option label="固定在左侧" value="left"></el-option>
              <el-option label="固定在右侧" value="right"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </form-basic-setting>
      <div>
        <el-divider>数据列</el-divider>
        <draggable
          :list="activeData.columns"
          :animation="340"
          group="selectRow"
          handle=".option-drag"
          @end="changeRenderKey"
        >
          <div v-for="(item, index) in activeData.columns" :key="index" class="select-item">
            <div class=" option-drag select-line-icon">
              <i class="el-icon-s-operation" />
            </div>
            <el-input v-model="item.label" placeholder="标题" size="small" @change="changeRenderKey" />
            <el-input v-model="item.prop" placeholder="数据字段" size="small" @change="changeRenderKey"/>
            <div class="edit-btn select-line-icon">
              <i class="el-icon-edit" @click="columnSetting(item, index)" />
            </div>
            <div class="close-btn select-line-icon" @click="deleteTableColumn(index)">
              <i class="el-icon-delete" />
            </div>
          </div>
        </draggable>
        <div style="margin-left: 20px;">
          <el-button
            style="padding-bottom: 0;"
            icon="el-icon-circle-plus-outline"
            type="text"
            @click="addTableColumn"
          >
            添加数据列
          </el-button>
        </div>
      </div>
    </el-form>
    <!-- 设置列 -->
    <action-dialog
      title="列设置"
      v-model="columnSettingVisible"
      width="30%"
      @confirm="columnSettingConfirm"
    >
      <action-form
        ref="columnSettingRef"
        :model="columnSettingFormModel"
        :formOptions="columnSettingFormOptions"
        :span="24"
      >
      </action-form>
    </action-dialog>
  </div>
</template>

<script>
import mixins from '../mixins'
import formBasicSetting from '../formBasicSetting.vue'
import { mapMutations } from 'vuex'
import { getComponentsList, getComponent } from './componentsList.js'
export default {
  mixins: [mixins],
  components: {
    formBasicSetting,
  },
  data () {
    return {
      currentIndex: 0,
      columnSettingVisible: false,
      columnSettingFormModel: {},
      columnSettingFormOptions: [
        {
          label: '标题',
          prop: 'label',
          rules: [
            { required: true, message: "请输入标题", trigger: "blur" }
          ]
        },
        {
          label: '数据字段',
          prop: 'prop',
          rules: [
            { required: true, message: "请输入数据字段", trigger: "blur" }
          ]
        },
        {
          label: '组件类型',
          prop: 'component',
          type: 'select',
          options: getComponentsList(),
          rules: [
            { required: true, message: "请选择组件类型", trigger: "change" }
          ],
          change: (value) => {
            this.changedComponent = getComponent(value)
          }
        },
        {
          label: '列宽',
          prop: 'width',
          type: 'inputNumber'
        }
      ],
      changedComponent: null // 监听组件类型的变化，如果有变动，就要响应改变__config__.children中的值
    }
  },
  methods: {
    ...mapMutations('codeEditor/components', ['changeRenderKey']),
    addTableColumn () {
      this.activeData.columns.push({
        label: '',
        prop: '',
        component: 'DANHANGWENBEN',
        width: '180'
      })
      this.activeData.__config__.children.push(getComponent('DANHANGWENBEN'))
    },
    deleteTableColumn (index) {
      this.activeData.columns.splice(index, 1)
      this.activeData.__config__.children.splice(index, 1)
    },
    columnSetting (item, index) {
      this.currentIndex = index
      this.columnSettingVisible = true
      this.changedComponent = null
      this.$nextTick(() => {
        this.$refs.columnSettingRef.reset()
        this.columnSettingFormModel = JSON.parse(JSON.stringify(item))
      })
    },
    columnSettingConfirm () {
      this.$refs.columnSettingRef.getRef().validate(valid => {
        if (valid) {
          this.$set(this.activeData.columns, this.currentIndex, JSON.parse(JSON.stringify(this.columnSettingFormModel)))
          if (this.changedComponent) {
            this.activeData.__config__.children[this.currentIndex] = this.changedComponent
          }
          this.columnSettingVisible = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.select-item {
  display: flex;
  margin-bottom: 3px;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  .edit-btn {
    cursor: pointer;
    color: #419eff;
  }
  & .el-input + .el-input {
    margin:0px 4px;
  }
}
.select-line-icon {
  padding: 0 4px;
  line-height: 32px;
  font-size: 16px;
  color: #777;
}
</style>