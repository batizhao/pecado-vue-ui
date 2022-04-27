<template>
  <el-input
    v-model="newValue"
    style="width: 100%"
    :readonly="unitValue === 'auto'"
    size="small"
    @click.native.stop
    v-bind="$attrs"
  >
    <template slot="append">
      <div class="unit-input-append">
        <div class="add-icons" v-show="unitValue !== 'auto'">
          <i class="el-icon-caret-top" @click="addNum"></i>
          <i class="el-icon-caret-bottom" @click="minusNum"></i>
        </div>
        <el-select v-model="unitValue" style="width: 78px" @change="unitChange">
          <el-option v-for="item in unitList" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </div>
    </template>
  </el-input>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    defaultUnitValue: {
      type: String,
      default: 'px'
    },
    unitList: {
      type: Array,
      default: () => ['px', '%', 'auto', 'em', 'rem', 'calc']
    },
    max: {
      type: Number
    }
  },
  computed: {
    newValue: {
      get () {
        if (!this.value) return ''
        if (this.value === 'auto') {
          this.setUnitValue('auto')
          return 'auto'
        }
        if (this.value.startsWith('calc')) {
          this.setUnitValue('calc')
          const matchResult = this.value.match(/calc\((.+)\)/)
          return matchResult[1]
        }
        // 拆分数字和单位
        const matchResult = this.value.match(/([0-9.]+)(.+)/)
        this.setUnitValue(matchResult[2])
        return matchResult[1]
      },
      set (val) {
        let result
        const value = this.unitValue === 'calc' ? val : val.trim()
        if (value === '') { // 如果输入框为空，就输入一个undefined
          result = undefined
        } else {
          if (this.unitValue === 'auto') { // 如果单位为auto就输出auto
            result = 'auto'
          } else if (this.unitValue === 'calc') { // 如果单位为calc就用calc()包裹
            result = `calc(${value})`
          } else {
            if (isNaN(Number(value))) { // 如果不为数字也输出undefined
              result = undefined
            } else {
              if (this.max !== undefined && Number(value) >= this.max) { // 如果数字大于max就重置为max值
                result = this.max + this.unitValue
              } else {
                result = value + this.unitValue // 如果为数字就输出数字加单位
              }
            }
          }
        }
        this.$emit('input', result)
        this.$emit('change', result)
      }
    }
  },
  data () {
    return {
      unitValue: this.defaultUnitValue
    }
  },
  methods: {
    unitChange (val) {
      if (val === 'auto') {
        this.newValue = 'auto'
      } else if (val === 'calc') {
        this.newValue = '100vh - 70px'
      } else {
        this.newValue = ''
      }
    },
    addNum () {
      if (this.max !== undefined && Number(this.newValue) >= this.max) return
      this.newValue = String(Number(this.newValue) + 1)
    },
    minusNum () {
      if (Number(this.newValue) <= 0) return
      this.newValue = String(Number(this.newValue) - 1)
    },
    setUnitValue (val) {
      this.unitValue = val
    }
  }
}
</script>
<style scoped>
.unit-input-append {
  position: relative;
}
.add-icons {
  position: absolute;
  top: -6px;
  left: -37px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #666;
}
.add-icons i:hover {
  color: dodgerblue;
}
</style>
