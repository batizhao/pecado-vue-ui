<template>
  <div class="action-edit-table">
    <el-form ref="form" :model="form">
      <el-form-item>
        <el-table
          :data="form.data"
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
            :index="indexMethod"
            :align="align"
          >
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tableColumns"
            :key="index"
            :align="align"
          >
            <template slot="header">
              <span :class="{ 'red-star': hasRedStar(item.rules)}">{{item.label}}</span>
            </template>
            <template slot-scope="{ row, $index }">
              <el-form-item
                :prop="`data.${$index}.${item.prop}`"
                :rules="item.rules"
              >
                <!-- 下拉框 -->
                <template v-if="item.type === 'select'">
                  <el-select
                    v-model="row[item.prop]"
                    style="width: 100%;"
                    clearable
                    :size="size"
                    :disabled="item.disabled || readonlyCondition(row)"
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
                  <span v-show="readonlyCondition(row)">{{row[item.prop]}}</span>
                  <el-input-number
                    v-show="!readonlyCondition(row)"
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
                    :disabled="item.disabled || readonlyCondition(row)"
                  ></el-checkbox>
                </template>
                <!-- 默认为输入框 -->
                <template v-else>
                  <span v-show="readonlyCondition(row)">{{row[item.prop]}}</span>
                  <el-input
                    v-show="!readonlyCondition(row)"
                    :size="size"
                    v-model="row[item.prop]"
                    :disabled="item.disabled"
                  ></el-input>
                </template>
              </el-form-item>
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
    tableColumns: Array, // 列配置
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
    }
    
  },
  data() {
    return {
      selectedItems: [], // 选中的数据
      form: {
        data: []
      },
      globalId: 0
    }
  },
  watch: {
    defaultData () {
      this.setDefaultValue()
    }
  },
  methods: {
    setDefaultValue () {
      const defaultData = JSON.parse(JSON.stringify(this.defaultData))
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
    addRow () {
      const row = {}
      this.tableColumns.map(item => {
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
      this.form.data.push(row)
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
    getRef () {
      return this.$refs.form
    },
    getData () {
      return JSON.parse(JSON.stringify(this.form.data))
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
    margin: 20px 10px;
  }
  .el-table td .cell {
    overflow-y: auto;
  }
}
</style>