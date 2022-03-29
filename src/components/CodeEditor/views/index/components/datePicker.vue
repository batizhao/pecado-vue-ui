<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting></form-basic-setting>
      <el-form-item label="能否清空">
        <el-switch v-model="activeData.clearable" />
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch v-model="activeData.disabled" />
      </el-form-item>
      <el-form-item label="是否只读">
        <el-switch v-model="activeData.readonly" />
      </el-form-item>
      <el-form-item label="默认值">
        <el-input
          :value="setDefaultValue(activeData.__config__.defaultValue)"
          placeholder="请输入默认值"
          @input="onDefaultValueInput"
        />
      </el-form-item>
      <el-form-item label="时间类型">
        <el-select v-model="activeData.type" placeholder="请选择时间类型" @change="dateTypeChange" :disabled="activeData.assemblyStatus">
          <el-option
            v-for="(item, index) in dateOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间格式">
        <el-input
          :value="activeData.format"
          placeholder="请输入时间格式"
          @input="setTimeValue($event)"
          disabled
        />
      </el-form-item>
      <template v-if="activeData.type === 'daterange' || activeData.type === 'datetimerange'">
        <el-form-item label="开始占位">
          <el-input v-model="activeData['start-placeholder']" placeholder="请输入占位提示" />
        </el-form-item>
        <el-form-item label="结束占位">
          <el-input v-model="activeData['end-placeholder']" placeholder="请输入占位提示" />
        </el-form-item>
        <el-form-item label="分隔符">
          <el-input v-model="activeData['range-separator']" placeholder="请输入分隔符" />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="占位提示">
          <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import { setDefaultValue, onDefaultValueInput } from './utils'
import mixins from './mixins'
import formBasicSetting from './formBasicSetting.vue'
const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
}
export default {
  components: {
    formBasicSetting
  },
  mixins: [mixins],
  data() {
    return {
      dateTypeOptions: [
        {
          label: '日(date)',
          value: 'date'
        },
        // {
        //   label: '周(week)',
        //   value: 'week'
        // },
        // {
        //   label: '月(month)',
        //   value: 'month'
        // },
        // {
        //   label: '年(year)',
        //   value: 'year'
        // },
        {
          label: '日期时间(datetime)',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: '日期范围(daterange)',
          value: 'daterange'
        },
        // {
        //   label: '月范围(monthrange)',
        //   value: 'monthrange'
        // },
        {
          label: '日期时间范围(datetimerange)',
          value: 'datetimerange'
        }
      ]
    }
  },
  computed: {
    dateOptions() {
      if (
        this.activeData.type !== undefined &&
        ['el-date-picker', 'date-range-picker'].includes(this.activeData.__config__.tag) 
      ) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions
        }
        return this.dateRangeTypeOptions
      }
      return []
    }
  },
  methods: {
    setDefaultValue,
    onDefaultValueInput,
    setTimeValue(val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val
      this.activeData.__config__.defaultValue = null
      this.activeData['value-format'] = valueFormat
      this.activeData.format = val
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    }
  }
}
</script>
