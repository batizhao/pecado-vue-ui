<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
      <template v-if="activeData.__config__.tag === 'department-selector-2'">
        <el-divider>分类</el-divider>
        <draggable :list="activeData.options" :animation="340">
            <div
              v-for="(item, index) in activeData.options"
              :key="index"
              class="select-item"
            >
              <div class="select-line-icon option-drag">
                <i class="el-icon-s-operation" />
              </div>
              <el-select
                v-model="activeData.options[index]"
                size="small"
                :value-key="'value'"
              >
                <el-option
                  v-for="option in departmentTypeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option"
                ></el-option>
              </el-select>
              <div class="close-btn select-line-icon" @click="activeData.options.splice(index, 1)">
                <i class="el-icon-delete" />
              </div>
            </div>
          </draggable>
          <div style="margin-left: 20px;">
            <el-button
              style="padding-bottom: 0;"
              icon="el-icon-circle-plus-outline"
              type="text"
              @click="addSelectItem"
            >
              添加选项
            </el-button>
          </div>
      </template>
      <options></options>
      </form-basic-setting>
    </el-form>
  </div>
</template>

<script>
import mixins from './mixins'
import formBasicSetting from './formBasicSetting.vue'
import options from './options/index.vue'
import request from '@/utils/request'
export default {
  mixins: [mixins],
  components: {
    formBasicSetting,
    options
  },
  data () {
    return {
      departmentTypeOptions: []
    }
  },
  created () {
    this.getDepartmentTypeOptions()
  },
  methods: {
    getDepartmentTypeOptions () {
      request({
        url: '/system/dictionary/dept_level'
      }).then(res => {
        this.departmentTypeOptions = this.activeData.options = res.data.map(item => ({
          label: item.label,
          value: item.value
        }))
        
      })
    },
    addSelectItem () {
      this.activeData.options.push({})
    }
  }
}
</script>
<style lang="scss" scoped>
.select-item {
  display: flex;
  box-sizing: border-box;
  border: 1px dashed #fff;
  & .close-btn {
    cursor: pointer;
    font-size: 16px;
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
</style>
