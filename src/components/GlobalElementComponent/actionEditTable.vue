<template>
  <div class="action-edit-table">
    <el-form ref="form" :model="form">
      <el-form-item>
        <el-table
          :data="form.data"
          :key="tableRenderKey"
          border
          size="mini"
          @selection-change="selectionChange"
        >
          <el-table-column
            v-if="showSelection"
            type="selection"
            width="60"
            :align="align"
          >
          </el-table-column>
          <el-table-column
            v-if="showOrderNumber"
            type="index"
            label="序号"
            width="55"
            fixed="left"
            :index="indexMethod"
            :align="align"
          >
          </el-table-column>
          <template v-for="(item, index) in newTableColumns">
            <el-table-column
              v-if="item.prop"
              :key="index"
              :align="align"
              :min-width="item.width || 150"
              show-overflow-tooltip
            >
              <template slot="header">
                <span :class="{ 'red-star': item.hasRedStar}">{{item.label}}</span>
              </template>
              <template slot-scope="{ row, $index }">
                <el-form-item
                  :prop="`data.${$index}.${item.prop}`"
                  :rules="item.rules"
                >
                  <!-- 下拉框 -->
                  <template v-if="item.type === 'select'">
                    <span v-if="isReadonly(row, item)">
                      {{ getSelectorLabel(row, item) }}
                    </span>
                    <el-select
                      v-if="!isReadonly(row, item)"
                      v-model="row[item.prop]"
                      style="width: 100%;"
                      clearable
                      :size="size"
                      :disabled="item.disabled"
                      @change="selectChange(item, row[item.prop], $index)"
                    >
                      <el-option
                        v-for="option in item.options"
                        :key="option[item.optionsProps ? item.optionsProps.value : 'value']"
                        :label="option[item.optionsProps ? item.optionsProps.label : 'label']"
                        :value="option[item.optionsProps ? item.optionsProps.value : 'value']"
                      ></el-option>
                    </el-select>
                  </template>
                  <!-- 数字输入框 -->
                  <template v-else-if="item.type === 'inputNumber'">
                    <span v-if="isReadonly(row, item)">{{row[item.prop]}}</span>
                    <el-input-number
                      v-if="!isReadonly(row, item)"
                      v-model="row[item.prop]"
                      style="width: 100%;"
                      :disabled="item.disabled"
                      :size="size"
                      :min="item.min"
                      :max="item.max"
                    ></el-input-number>
                  </template>
                  <!-- 单个复选框 -->
                  <template v-else-if="item.type === 'checkbox'">
                    <el-checkbox
                      v-model="row[item.prop]"
                      :disabled="item.disabled || isReadonly(row, item)"
                    ></el-checkbox>
                  </template>
                  <!-- 开关 -->
                  <template v-else-if="item.type === 'switch'">
                    <el-switch
                      v-model="row[item.prop]"
                      :disabled="item.disabled || isReadonly(row, item)"
                      :active-value="item.activeValue"
                      :inactive-value="item.inactiveValue"
                    ></el-switch>
                  </template>
                  <!-- 插槽 -->
                  <template v-else-if="item.type === 'slot'">
                    <slot :name="item.slotName || item.prop" :row="row" :index="$index"></slot>
                  </template>
                  <!-- 默认为输入框 -->
                  <template v-else>
                    <span v-if="isReadonly(row, item)">{{row[item.prop]}}</span>
                    <el-input
                      v-if="!isReadonly(row, item)"
                      :size="size"
                      v-model="row[item.prop]"
                      :disabled="item.disabled"
                    ></el-input>
                  </template>
                </el-form-item>
              </template>
            </el-table-column>
          </template>
          <el-table-column
            v-if="operationColumn.show"
            label="操作"
            align="center"
            :fixed="operationColumn.fixed"
            :min-width="operationColumn.width"
          >
            <template slot-scope="scope">
              <!-- 上移下移功能按钮 -->
              <template v-if="operationColumn.movable">
                <el-button
                  type="text"
                  icon="el-icon-caret-top"
                  size="mini"
                  @click="moveUp(scope)"
                  :disabled="scope.$index === 0"
                >上移</el-button>
                <el-button
                  type="text"
                  icon="el-icon-caret-bottom"
                  size="mini"
                  @click="moveDown(scope)"
                  :disabled="scope.$index ==form.data.length - 1"
                >下移</el-button>
              </template>
              <!-- 其他插槽 -->
              <slot name="action" :row="scope.row"></slot>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    defaultData: Array, // 默认数据
    showSelection: Boolean, // 显示复选框
    showOrderNumber: { // 显示序号
      type: Boolean,
      default: true
    },
    tableColumns: { // 列配置
      type: Array,
      required: true
    },
    size: { // 组件大小
      type: String,
      default: 'mini'
    },
    align: { // 对齐方式
      type: String,
      default: 'center'
    },
    readonlyCondition: {
      type: Function, // 传入判断行数据是否只读的函数
      default: () => {}
    },
    operationColumn: { // 操作列配置
      type: Object,
      default: () => ({
        show: false, // 是否显示
        fixed: false, // 固定
        width: undefined, // 宽度
        movable: false // 可上下移动
      })
    },
    addRowIndex: Number // 指定新增行数据时插入的位置,如果为正数就从头插入，如果为负数就从尾插入
  },
  data() {
    return {
      selectedItems: [], // 选中的数据
      form: {
        data: []
      },
      globalId: 0,
      tableRenderKey: new Date() * 1,
      newTableColumns: []
    }
  },
  created () {
    this.setDefaultValue()
  },
  watch: {
    defaultData () {
      this.setDefaultValue()
    },
    'form.data': {
      handler: function (value) {
        this.$emit('change', value)
      },
      deep: true
    },
    tableColumns: {
      handler: function (value = [], oldValue = []) {
        if (this.$parent.$options.name === 'subform-table') {
          // 收集所有列的必填设置，如果有任一列必填设置变化，就使表格重新渲染
          let allRequired = ''
          let oldAllREquired = ''
          value.map(item => {
            allRequired += String(item.rules[0].required)
          })
          oldValue.map(item => {
            oldAllREquired += String(item.rules[0].required)
          })
          if (allRequired !== oldAllREquired) {
            this.tableRenderKey = new Date() * 1
          }
        }

        this.newTableColumns = value.map(item => {
          this.$set(item, 'hasRedStar', this.hasRedStar(item.rules))
          return item
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 设置某行数据某个属性的值
    setValue (index, attrName, value) {
      this.$set(this.form.data[index], attrName, value)
    },
    getRef () {
      return this.$refs.form
    },
    getData () {
      return JSON.parse(JSON.stringify(this.form.data))
    },
    setDefaultValue () {
      const defaultData = JSON.parse(JSON.stringify(this.defaultData || []))
      defaultData.map(item => {
        item.globalId = this.globalId ++
      })
      this.form.data = defaultData
    },
    indexMethod (index) {
      return index + 1
    },
    selectionChange (data) {
      this.selectedItems = data
    },
    hasRedStar (rules) {
      if (!rules) return false
      const item = rules.find(item => item.required === true)
      return Boolean(item)
    },
    isReadonly (row, item) {
      return this.readonlyCondition(row) || item.readonly
    },
    addRow () {
      const row = {}
      this.newTableColumns.map(item => {
        // 如果有默认值就设为默认值
        if (item.defaultValue !== undefined) {
          row[item.prop] = item.defaultValue
        } else {
          switch (item.type) {
            case 'inputNumber':
              row[item.prop] = 0
              break
            case 'checkbox':
              row[item.prop] = false
              break
            default: 
              row[item.prop] = ''
          }
        }
      })
      row.globalId = this.globalId ++
      const tableData = this.form.data
      if (this.addRowIndex !== undefined) {
        tableData.splice((this.addRowIndex >= 0 ? 0 : tableData.length) + this.addRowIndex, 0, row)
      } else {
        tableData.push(row)
      }
    },
    deleteRow (callback) {
      if (!this.selectedItems.length) {
        this.msgInfo('未选中数据')
        return
      }
      // 删除前可做一些数据判断，返回true就可以删除，返回false就不让删除
      if ((callback && callback(this.selectedItems)) || !callback) {
        const deleteIds = this.selectedItems.map(item => item.globalId)
        for (let i = this.form.data.length - 1; i >= 0; i-- ) {
          const item = this.form.data[i]
          if (deleteIds.includes(item.globalId)) {
            this.form.data.splice(i, 1)
          }
        }
        this.selectedItems = []
      }
    },
    moveUp (scope) {
      const delItem = this.form.data.splice(scope.$index, 1)
      this.form.data.splice(scope.$index - 1, 0, delItem[0])
    },
    moveDown (scope) {
      const delItem = this.form.data.splice(scope.$index, 1)
      this.form.data.splice(scope.$index + 1, 0, delItem[0])
    },
    // change回调
    selectChange (item, value, index) {
      if (item.change) {
        item.change(value, item, index)
      }
    },
    // 获取下拉框的label
    getSelectorLabel (row, item) {
      const target =  item.options.find(option => option[item.optionsProps ? item.optionsProps.value : 'value'] === row[item.prop])
      return target ? target[item.optionsProps ? item.optionsProps.label : 'label'] : row[item.prop]
    }
  }
}
</script>

<style scoped>
.red-star::before {
  content: '* ';
  color: red;
}
</style>
<style lang="scss">
.action-edit-table {
   .el-form-item__content {
    line-height: 0;
  }
  .el-form-item .el-form-item {
    margin: 15px 10px;
  }
}
</style>