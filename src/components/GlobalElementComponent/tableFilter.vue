<template>
  <div class="table-filter">
    <el-row :gutter="10">
      <el-form
        v-if="conditions.length"
        ref="tableFilterRef"
        :model="form"
        label-width="80px"
        size="small"
        style="display: flex;flex-wrap: wrap;"
      >
        <el-col
          v-bind="grid"
          v-for="(item, index) in conditions"
          :key="index"
        >
          <el-form-item :label="item.label" :prop="item.prop">
            <!-- 下拉框 -->
            <el-select
              v-if="item.componentType === 'select'"
              v-model="form[item.prop]"
              :placeholder="'请选择'+item.label"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
            <!-- 日期选择器 -->
            <el-date-picker
              v-else-if="item.componentType === 'date'"
              v-model="form[item.prop]"
              type="date"
              :placeholder="'请选择'+item.label"
            >
            </el-date-picker>
            <!-- 时间 -->
            <el-time-picker
              v-else-if="item.componentType === 'time'"
              v-model="form[item.prop]"
              :placeholder="'请选择'+item.label"
            >
            </el-time-picker>
            <!-- 数字 -->
            <el-input-number
              v-else-if="item.componentType === 'number'"
              v-model="form[item.prop]"
            ></el-input-number>
            <!-- 默认输入框 -->
            <el-input
              v-else
              v-model="form[item.prop]"
              :placeholder="'请输入'+item.label"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col v-bind="grid">
          <el-button type="primary" icon="el-icon-search" size="small" @click="queryClick" :loading="loading">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetClick">重置</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    conditions: Array,
    loading: Boolean
  },
  data () {
    return {
      grid: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
      form: {}
    }
  },
  created () {
    },
  methods: {
    queryClick () {
      this.$emit('query', this.form)
    },
    resetClick () {
      this.form = {}
      this.$emit('query', JSON.parse(JSON.stringify(this.form)))
    }
  }
}
</script>

<style scoped>
.table-filter {
  margin: 10px 0;
}
</style>
