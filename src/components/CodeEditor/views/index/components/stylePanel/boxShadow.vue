<template>
  <el-form size="small" label-width="70px">
    <el-form-item label="颜色">
      <el-color-picker v-model="newValue.color" @change="colorChange"></el-color-picker>
    </el-form-item>
    <el-form-item label="X偏移">
      <unit-input v-model="newValue.x" @change="xChange"></unit-input>
    </el-form-item>
    <el-form-item label="Y偏移">
      <unit-input v-model="newValue.y" @change="yChange"></unit-input>
    </el-form-item>
    <el-form-item label="模糊距离">
      <unit-input v-model="newValue.blur" @change="blurChange"></unit-input>
    </el-form-item>
    <el-form-item label="阴影大小">
      <unit-input v-model="newValue.spread" @change="spreadChange"></unit-input>
    </el-form-item>
  </el-form>
</template>

<script>
import unitInput from './unitInput.vue'
export default {
  components: { unitInput },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    newValue: {
      get () {
        const arr = this.value.split(' ')
        return {
          x: arr[0],
          y: arr[1],
          blur: arr[2],
          spread: arr[3],
          color: arr[4]
        }
      },
      set (val) {
        let result = ''
        let isAllUndefined = true
        for (const key in val) {
          const valKey = val[key]
          if (valKey) {
            isAllUndefined = false
          }
          if (key === 'color') {
            result += (valKey || '')
          } else {
            result += ((valKey || '0px') + ' ')
          }
        }
        this.$emit('input', isAllUndefined ? undefined : (result === '0px 0px 0px 0px ' ? undefined : result))
      }
    }
  },
  methods: {
    xChange (val) {
      this.newValue = { ...this.newValue, x: val }
    },
    yChange (val) {
      this.newValue = { ...this.newValue, y: val }
    },
    blurChange (val) {
      this.newValue = { ...this.newValue, blur: val }
    },
    spreadChange (val) {
      this.newValue = { ...this.newValue, spread: val }
    },
    colorChange (val) {
      if (val) {
        this.newValue = { ...this.newValue, color: val }
      } else {
        this.newValue = {
          x: '',
          y: '',
          blur: '',
          spread: '',
          color: ''
        }
      }
    }
  }
}
</script>
