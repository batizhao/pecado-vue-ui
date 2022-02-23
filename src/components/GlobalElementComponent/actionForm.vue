<template>
  <el-form ref="form" :model="model" :rules="rules" :label-width="labelWidth">
    <el-row :gutter="10">
      <el-col :span="span" v-for="(item, index) in formOptions" :key="index">
        <el-form-item :label="item.label" :prop="item.prop">
          <!-- 下拉框 -->
          <template v-if="item.type === 'select'">
            <el-select v-model="model[item.prop]" style="width: 100%;" clearable>
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
            <el-input-number v-model="model[item.prop]"  controls-position="right" style="width: 100%;"></el-input-number>
          </template>
          <!-- 多行输入框 -->
          <template v-else-if="item.type === 'textarea'">
            <el-input v-model="model[item.prop]" type="textarea" placeholder="请输入"></el-input>
          </template>
          <!-- 插槽 -->
          <template v-else-if="item.type === 'slot'">
            <slot :name="item.prop"></slot>
          </template>
          <!-- 默认渲染输入框 -->
          <template v-else>
            <el-input v-model="model[item.prop]" placeholder="请输入"></el-input>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    // 表单模型
    model: Object,
    // 生成表单的配置
    formOptions: Array,
    // 标签宽度
    labelWidth: {
      type: String,
      default: '80px'
    },
    // 布局
    span: {
      type: Number,
      default: 12
    }
  },
  computed: {
    rules () {
      const rules = {}
      this.formOptions.map(item => {
        if (item.rules) {
          rules[item.prop] = item.rules
        }
      })
      return rules

    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields();
    },
    getRef () {
      return this.$refs.form
    }
  }
}
</script>
