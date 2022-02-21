<template>
  <div class="table-filter">
    <el-row :gutter="10">
      <el-form ref="tableFilterRef" :model="form" label-width="80px">
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
          <el-form-item label="">
            <el-button type="primary" @click="queryClick" :loading="loading">查询</el-button>
            <el-button @click="resetClick">重置</el-button>
          </el-form-item>
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
      grid: { xs: 12, sm: 12, md: 8, lg: 8, xl: 6 },
      form: {}
    }
  },
  methods: {
    queryClick () {
      this.$emit('query', this.form)
    },
    resetClick () {
      this.$refs.tableFilterRef.resetFields()
      this.$emit('query', this.form)
    }
  }
}
</script>

<style scoped>
.table-filter {
  margin: 10px 0;
}
</style>
