<template>
  <div>
    <el-divider>正则校验</el-divider>
    <div
      v-for="(item, index) in activeData.__config__.regList"
      :key="index"
      class="reg-item"
    >
      <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
        <i class="el-icon-close" />
      </span>
      <el-form-item label="表达式">
        <el-input v-model="item.pattern" placeholder="请输入正则" >
          <el-button slot="append" @click="setReg(index)">预设</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="错误提示">
        <el-input v-model="item.message" placeholder="请输入错误提示" />
      </el-form-item>
      <el-form-item label="触发方式">
        <el-select v-model="item.trigger">
          <el-option value="change" label="change"></el-option>
          <el-option value="blur" label="blur"></el-option>
        </el-select>
      </el-form-item>
    </div>
    <div style="margin-left: 20px;">
      <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
        添加规则
      </el-button>
    </div>

    <el-dialog title="预设正则列表" :visible.sync="dialogTableVisible" :append-to-body="true">
      <el-table :data="presetRegList" style="width: 100%;">
        <el-table-column property="label" label="类型" min-width="50"></el-table-column>
        <el-table-column property="value" label="正则表达式" min-width="200"></el-table-column>
        <el-table-column label="操作" min-width="50">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data () {
    return {
      dialogTableVisible: false,
      presetRegList: [
        {
          label: '手机号',
          value: '/^1(3|4|5|7|8|9)\\d{9}$/'
        },
        {
          label: '邮箱',
          value: '/^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$/'
        },
        {
          label: '邮箱',
          value: '/^[a-z\\d]+(\\.[a-z\\d]+)*@([\\da-z](-[\\da-z])?)+(\\.{1,2}[a-z]+)+$/'
        },
        {
          label: 'URL',
          value: '/^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$/'
        },
        {
          label: '汉字',
          value: '/^[\\u4e00-\\u9fa5]{0,}$/'
        },
        {
          label: '英文和数字',
          value: '/^[A-Za-z0-9]+$/'
        }
      ]
    }
  },
  methods: {
    addReg () {
      this.activeData.__config__.regList.push({
        pattern: '',
        message: '',
        trigger: 'change'
      })
    },
    setReg (index) {
      this.dialogTableVisible = true
      this.currentReg = index
    },
    handleClick (row) {
      this.dialogTableVisible = false
      this.activeData.__config__.regList[this.currentReg].pattern = row.value
      this.activeData.__config__.regList[this.currentReg].message = row.label + '格式错误'
    }
  }
}
</script>
<style lang="scss" scoped>
.reg-item{
  padding: 12px 6px;
  background: #f8f8f8;
  position: relative;
  border-radius: 4px;
  .close-btn{
    position: absolute;
    right: -6px;
    top: -6px;
    display: block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    color: #fff;
    text-align: center;
    z-index: 1;
    cursor: pointer;
    font-size: 12px;
    &:hover{
      background: rgba(210, 23, 23, 0.5)
    }
  }
  & + .reg-item{
    margin-top: 18px;
  }
}
</style>
