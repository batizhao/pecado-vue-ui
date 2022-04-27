<template>
  <div>
    <el-select
      v-model="selectedItems"
      :value-key="props.value"
      multiple
      @focus="selectFocus"
      popper-class="department-popper"
    >
      <el-option
        v-for="item in selectedItems"
        :key="item[props.value]"
        :label="item[props.label]"
        :value="item"
      ></el-option>
    </el-select>

    <action-dialog
      v-model="dialogVisible"
      title="部门选择"
      @confirm="dialogConfirm"
      width="80%"
    >
    <el-row>
      <el-col :sm="24" :md="10">
        <el-tree
          show-checkbox
          check-strictly
          ref="treeRef"
          :data="treeData"
          :props="props"
          :node-key="props.value"
          @check-change="treeCheck"
        ></el-tree>
      </el-col>
      <el-col :sm="24" :md="14">
        <div class="selected-nodes">
          <draggable
            :list="selectedNodes"
            :animation="340"
          >
            <el-tag
              v-for="(item, index) in selectedNodes"
              :key="index"
              closable
              @close="removeNode(item)"
            >
              {{item[props.label]}}
            </el-tag>
          </draggable>
          <div class="tips" v-show="!selectedNodes.length">请选择</div>
        </div>
      </el-col>
    </el-row>
    </action-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import draggable from 'vuedraggable'
export default {
  name: 'department-selector-1',
  components: {
    draggable
  },
  props: {
    value: Array,
    __config__: Object,
    props: Object,
    options: Array
  },
  data () {
    return {
      selectedItems: this.value,
      dialogVisible: false,
      treeData: [],
      selectedNodes: []
    }
  },
  watch: {
    selectedItems: {
      handler (value) {
        this.$emit('input', value)
      },
      deep: true
    }
  },
  mounted () {
    this.getOptions()
    this.selectedItems = []
  },
  methods: {
    getOptions () {
      const conf = this.__config__
      if (conf.dataType === 'dynamic') {
        const { method, url, dataPath } = this.__config__
        if (method && url) {
          request({ method, url })
            .then((res) => {
              if (!dataPath) {
                console.error('dataPath值不存在')
                return
              }
              // 根据dataPath获取到请求的指定位置的数据
              const respData = dataPath.split('.').reduce((pre, item) => pre[item], res)
              if (!respData) {
                this.$message.error('数据位置有误')
                return
              }
              const recursion = list => {
                for (const item of list) {
                  item.label = item[this.props.label]
                  item.value = item[this.props.value]
                  const children = item[this.props.children]
                  if (children instanceof Array && children.length) {
                    item.disabled = true
                    if (this.props.children !== 'children') {
                      item.children = children
                    }
                    recursion(children)
                  } else {
                    item.disabled = false
                  }
                }
              }
              recursion(respData)
              this.treeData = respData
            })
            .catch((err) => {
              this.$message.error(String(err))
              console.error(err)
            })
        } else {
          this.$message.error('请填写接口地址')
        }
      } else {
        this.treeData = JSON.parse(JSON.stringify(this.options))
      }
    },
    selectFocus (event) {
      this.$emit('focus', event)
      this.dialogVisible = true
      // 默认选中
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedNodes(this.selectedItems)
        this.selectedNodes = JSON.parse(JSON.stringify(this.selectedItems))
      })
    },
    treeCheck (value, status) {
      if (status) {
        this.selectedNodes.push({
          [this.props.value]: value[this.props.value],
          [this.props.label]: value[this.props.label]
        })
      } else {
        const index = this.selectedNodes.findIndex(item => item[this.props.value] === value[this.props.value])
        if (index !== -1) {
          this.selectedNodes.splice(index, 1)
        }
      }
    },
    removeNode (value) {
      const index = this.selectedNodes.findIndex(item => item[this.props.value] === value[this.props.value])
      if (index !== -1) {
        this.selectedNodes.splice(index, 1)
        this.$refs.treeRef.setChecked(value, false)
      }
    },
    dialogConfirm () {
      this.dialogVisible = false
      const data = JSON.parse(JSON.stringify(this.selectedNodes))
      this.selectedItems = data
    }
  },
}
</script>

<style>
.department-popper {
  display: none;
}
</style>
<style lang="scss" scoped>
.selected-nodes {
  height: 180px;
  border: 1px solid #ddd;
  padding: 10px;
  .el-tag {
    margin: 2px;
    cursor: move;
  }
  .tips {
    text-align: center;
    line-height: 130px;
    color: #b1b1b1;
  }
}
</style>