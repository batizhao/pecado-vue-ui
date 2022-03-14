<template>
  <el-form
    ref="form"
    :model="model"
    :rules="rules"
    :label-width="labelWidth"
    :label-position="labelPosition"
  >
    <el-row :gutter="10">
      <el-col :span="item.span || span" v-for="(item, index) in formOptions" :key="index">
        <!-- 下拉框 -->
        <el-form-item 
           v-if="item.type === 'select' && getShowCondition(item)"
          :label="item.label"
          :prop="item.prop"
        >
          <el-select
            v-model="model[item.prop]"
            style="width: 100%;"
            clearable
            :placeholder="'请选择' + item.label"
            :disabled="item.disabled"
          >
            <el-option
              v-for="option in item.options"
              :key="option[item.optionsProps ? item.optionsProps.value : 'value']"
              :label="option[item.optionsProps ? item.optionsProps.label : 'label']"
              :value="option[item.optionsProps ? item.optionsProps.value : 'value']"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 树型下拉框 -->
        <el-form-item
          v-else-if="item.type === 'treeSelect' && getShowCondition(item)"
          :label="item.label"
          :prop="item.prop"
        >
          <tree-select
            v-model="model[item.prop]"
            :options="transferTreeSelectOptions(item)"
            :normalizer="normalizer"
            :placeholder="'请选择' + item.label"
            :disabled="item.disabled"
          ></tree-select>
        </el-form-item>
        <!-- 数字输入框 -->
        <el-form-item
          v-else-if="item.type === 'inputNumber' && getShowCondition(item)"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input-number
            v-model="model[item.prop]"
            controls-position="right"
            style="width: 100%;"
            :disabled="item.disabled"
          ></el-input-number>
        </el-form-item>
        <!-- 多行输入框 -->
        <el-form-item
          v-else-if="item.type === 'textarea' && getShowCondition(item)"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input 
            v-model="model[item.prop]"
            type="textarea"
            :rows="3"
            :placeholder="'请输入' + item.label"
            :disabled="item.disabled"
          ></el-input>
        </el-form-item>
        <!-- 单选 -->
        <el-form-item
          v-else-if="item.type === 'radio' && getShowCondition(item)"
          :label="item.label"
          :prop="item.prop"
        >
          <el-radio-group
            v-model="model[item.prop]"
            :disabled="item.disabled"
            @change="selectChange(item, model[item.prop])"
          >
            <el-radio
              v-for="option in item.options"
              :key="option[item.optionsProps ? item.optionsProps.value : 'value']"
              :label="option[item.optionsProps ? item.optionsProps.value : 'value']"
            >
              {{option[item.optionsProps ? item.optionsProps.label : 'label']}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 多选 -->
        <el-form-item
          v-else-if="item.type === 'checkbox' && getShowCondition(item)"
          :prop="item.prop"
        >
          <template slot="label">
            {{item.label}}
            <!-- 是否显示全选 -->
            <el-checkbox
              v-if="item.checkAll"
              style="margin-left: 10px;"
              v-model="model[item.prop + 'CheckAll']"
              @change="checkAllChange(item, model[item.prop + 'CheckAll'])"
            >全选</el-checkbox>
          </template>
          <el-checkbox-group
            v-model="model[item.prop]"
            :disabled="item.disabled"
          >
            <el-checkbox
              v-for="option in item.options"
              :key="option[item.optionsProps ? item.optionsProps.value : 'value']"
              :label="option[item.optionsProps ? item.optionsProps.value : 'value']"
            >
              {{option[item.optionsProps ? item.optionsProps.label : 'label']}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 插槽 -->
        <el-form-item
          v-else-if="item.type === 'slot' && getShowCondition(item)"
          :label="item.label"
          :prop="item.prop"
        >
          <slot :name="item.slotName || item.prop"></slot>
        </el-form-item>
        <!-- 默认渲染输入框 -->
        <el-form-item
          v-else-if="(item.type === undefined || item.type === 'text') && getShowCondition(item)"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input
            v-if="getShowCondition(item)"
            v-model="model[item.prop]"
            :placeholder="'请输入' + item.label"
            :disabled="item.disabled"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: {
    TreeSelect
  },
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
    },
    // 标签位置
    labelPosition: String
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
    },
    // 表单元素显示的条件, 传入参数:showCondition函数
    getShowCondition (item) {
      return item.showCondition ? item.showCondition(this.model) : true
    },
    normalizer (node) {
      return {
        id: node.value,
        label: node.label,
        children: (node.children && node.children.length) ? node.children : undefined
      }
    },
    transferTreeSelectOptions (item) {
      // 这个函数不知道为什么会因为model对象其他属性值变化而触发, 所以一旦等options有值了就不在执行函数了
      if (this.transferTreeSelectOptionsFlag === 0) {
        return item.options
      }
      const options = item.options
      const optionsProps = item.optionsProps
      if (!optionsProps) {
        optionsProps = {
          value: 'value',
          label: 'label',
          children: 'children'
        }
      }
      const recursion = list => {
        for (let t of list) {
          t.value = t[optionsProps.value] !== undefined ? t[optionsProps.value] : '请配置optionsProps的value'
          t.label = t[optionsProps.label] !== undefined ? t[optionsProps.label] : '请配置optionsProps的label'
          t.children = t[optionsProps.children] || []
          if (t.children.length) {
            recursion(t.children)
          }
        }
      }
      recursion(options)
      if (options.length) {
        this.transferTreeSelectOptionsFlag = 0
      } else {
        this.transferTreeSelectOptionsFlag = 1
      }
      return options
    },
    // 多选框全选
    checkAllChange (item, value) {
      if (value) { // 全选
        // 1 拿到所有选项的值
        const values = item.options.map(option => {
          return option[item.optionsProps ? item.optionsProps.value : 'value']
        })
        // 2 赋值给对应的prop
        this.model[item.prop] = values
      } else { // 取消全需
        this.model[item.prop] = []
      }
    },
    // change回调
    selectChange (item, value) {
      if (item.change) {
        item.change(value)
      }
    }
  }
}
</script>
