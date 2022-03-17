<template>
  <div class="table-filter">
    <el-row :gutter="10">
      <el-form
        v-if="conditions.length"
        ref="tableFilterRef"
        :model="form"
        label-width="80px"
        size="small"
      >
        <el-col
          v-bind="grid"
          v-for="(item, index) in conditions"
          :key="index"
        >
          <el-form-item :label="item.label" :prop="item.prop">
            <el-input
              v-if="item.componentType === 'input'"
              v-model="form[item.prop]"
              :placeholder="'请输入'+item.label"
            ></el-input>
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
