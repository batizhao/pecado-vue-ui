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
      default: () => ['px', '%', 'auto', 'em', 'rem']
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
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.unitValue = 'auto'
          return 'auto'
        }
        // 拆分数字和单位
        const matchResult = this.value.match(/([0-9.]+)(.+)/)
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.unitValue = matchResult[2]
        return matchResult[1]
      },
      set (val) {
        // 如果输入框为空，就输入一个undefined
        // 如果为auto就输出auto
        // 如果不为数字也输出undefined
        // 如果为数字就输出数字加单位
        // 如果数字大于max就重置为max值
        let result
        const value = val.trim()
        if (value !== '' && value !== 'auto') {
          if (!isNaN(Number(value))) {
            if (this.max !== undefined && Number(value) >= this.max) {
              result = this.max + this.unitValue
            } else {
              result = value + this.unitValue
            }
          }
        } else if (value === 'auto') {
          result = 'auto'
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
      } else {
        this.newValue = this.newValue === 'auto' ? '' : this.newValue
      }
    },
    addNum () {
      if (this.max !== undefined && Number(this.newValue) >= this.max) return
      this.newValue = String(Number(this.newValue) + 1)
    },
    minusNum () {
      if (Number(this.newValue) <= 0) return
      this.newValue = String(Number(this.newValue) - 1)
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
