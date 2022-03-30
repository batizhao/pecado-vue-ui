<template>
  <div>
    <!-- 这个文件的选项配置是下拉框、级联的配置，表格的配置在tableOptions.vue中 -->
    <el-form size="small" label-width="90px">
      <el-divider>选项</el-divider>
      <el-form-item label="数据类型">
        <el-select
          v-model="activeData.__config__.dataType"
          placeholder="请选择"
          @change="changeRenderKey"
        >
          <el-option label="自定义" value="static"></el-option>
          <el-option
            v-if="['object-selector', 'object-cascader'].includes(activeData.__config__.tag)"
            label="动态数据"
            value="dynamic"
          ></el-option>
        </el-select>
      </el-form-item>

      <div v-if="activeData.__config__.dataType === 'dynamic'">
        <el-form-item label="接口地址">
          <el-input
            v-model="activeData.__config__.url"
            :title="activeData.__config__.url"
            placeholder="请输入接口地址"
            clearable
            @change="changeRenderKey"
          >
            <el-select
              slot="prepend"
              v-model="activeData.__config__.method"
              style="width: 85px !important;"
              @change="changeRenderKey"
            >
              <el-option label="get" value="get" />
              <!-- <el-option label="post" value="post" />
              <el-option label="put" value="put" />
              <el-option label="delete" value="delete" /> -->
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="数据位置">
          <el-input v-model="activeData.__config__.dataPath" placeholder="请输入数据位置" @change="changeRenderKey"/>
        </el-form-item>
        <template v-if="activeData.props && activeData.props.props">
          <el-form-item label="标签键名">
            <el-input v-model="activeData.props.props.label" placeholder="请输入标签键名"  @change="changeRenderKey"/>
          </el-form-item>
          <el-form-item label="值键名">
            <el-input v-model="activeData.props.props.value" placeholder="请输入值键名"  @change="changeRenderKey"/>
          </el-form-item>
          <el-form-item
            v-if="['object-cascader'].includes(activeData.__config__.tag)"
            label="子级键名"
          >
            <el-input v-model="activeData.props.props.children" placeholder="请输入子级键名" @change="changeRenderKey"/>
          </el-form-item>
        </template>
      </div>

      <template v-if="activeData.__config__.dataType === 'static'">
        <template
          v-if="
            ['object-checkbox-group', 'object-radio-group', 'object-selector'].includes(
              activeData.__config__.tag
            )
          "
        >
          <draggable
            :list="activeData.__slot__.options"
            :animation="340"
            group="selectItem"
            handle=".option-drag"
          >
            <div
              v-for="(item, index) in activeData.__slot__.options"
              :key="index"
              class="select-item"
            >
              <div class="select-line-icon option-drag">
                <i class="el-icon-s-operation" />
              </div>
              <el-input
                v-model="item[activeData.props.props.label]"
                placeholder="选项名"
                size="small"
                @change="changeRenderKey()"
              />
              <el-input
                v-model="item[activeData.props.props.value]"
                placeholder="值"
                size="small"
              />
              <div
                class="close-btn select-line-icon"
                @click="activeData.__slot__.options.splice(index, 1)"
              >
                <i class="el-icon-delete" />
              </div>
            </div>
          </draggable>
          <div style="margin-left: 20px;">
            <el-button
              style="padding-bottom: 0;"
              icon="el-icon-circle-plus-outline"
              type="text"
              @click="addSelectItem"
            >
              添加选项
            </el-button>
          </div>
        </template>
        <template
          v-if="['object-cascader', 'el-navmenu', 'el-tree'].includes(activeData.__config__.tag)"
        >
          <el-tree
            draggable
            :data="treeOptions"
            node-key="id"
            :expand-on-click-node="false"
            :props="activeData.props.props"
          >
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                {{ data[activeData.props.props.label] }}
                （{{data[activeData.props.props.value]}}）
                </span>
              <span class="node-operation">
                <i class="el-icon-plus" title="添加" @click="appendTreeItem(data)"></i>
                <i class="el-icon-delete" title="删除" @click="removeTreeItem(node, data)"></i>
              </span>
            </div>
          </el-tree>
          <div style="margin-left: 20px;">
            <el-button
              style="padding-bottom: 0;"
              icon="el-icon-circle-plus-outline"
              type="text"
              @click="addTreeItem"
            >
              添加父级
            </el-button>
          </div>
          <tree-node-dialog
            :visible.sync="treeNodeDialogVisible"
            :options="treeOptions"
            :tree-props="activeData.props.props"
            @commit="addTreeNode"
          />
        </template>
      </template>
    </el-form>
  </div>
</template>
<script>
import TreeNodeDialog from './TreeNodeDialog.vue'
import mixins from '../mixins'
import { mapState, mapMutations } from 'vuex'
import { isArray, findIndex } from 'lodash'
export default {
  components: {
    TreeNodeDialog,
  },
  mixins: [mixins],
  data () {
    return {
      treeNodeDialogVisible: false,
      currentNode: null,
      tableData: [],
      componentList: []
    }
  },

  computed: {
    ...mapState('codeEditor/components', ['activeIndex', 'drawingList']),
    treeOptions: {
      get () {
        return (
          this.activeData.options ||
          (this.activeData.props && this.activeData.props.options) ||
          this.activeData.data ||
          []
        )
      },
      set (val) {
        if (this.activeData.options) this.activeData.options = val
        if (this.activeData.props && this.activeData.props.options) {
          this.activeData.props.options = val
        }
        if (this.activeData.data) this.activeData.data = val
      }
    }
  },
  methods: {
    ...mapMutations('codeEditor/components', ['changeRenderKey']),
    tagDelete (scope, index) {
      this.activeData.__slot__.options[scope.$index].linkageList.splice(index, 1)
    },
    // 添加下拉框选项
    addSelectItem () {
      this.activeData.__slot__.options.push({
        [this.activeData.props.props.label]: '',
        [this.activeData.props.props.value]: ''
      })
    },
    // 添加级联下拉框选项
    addTreeItem () {
      this.treeNodeDialogVisible = true
      this.currentNode = this.treeOptions
    },
    appendTreeItem (data) {
      const childrenAttr = this.activeData.props.props.children
      if (!data[childrenAttr]) {
        this.$set(data, childrenAttr, [])
      }
      this.treeNodeDialogVisible = true
      this.currentNode = data[childrenAttr]
    },
    removeTreeItem (node, data) {
      this.activeData.__config__.defaultValue = [] // 避免删除时报错
      const childrenAttr = this.activeData.props.props.children
      const { parent } = node
      const children = parent.data[childrenAttr] || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
    },
    addTreeNode (data) {
      this.currentNode.push(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.select-item {
  display: flex;
  box-sizing: border-box;
  border: 1px dashed #fff;
  & .close-btn {
    cursor: pointer;
    font-size: 16px;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  padding: 0 4px;
  line-height: 32px;
  font-size: 22px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.custom-tree-node {
  width: 100%;
  font-size: 14px;
  .node-operation {
    float: right;
  }
  i[class*='el-icon'] + i[class*='el-icon'] {
    margin-left: 6px;
  }
  .el-icon-plus {
    color: #409eff;
  }
  .el-icon-delete {
    color: #f56c6c;
  }
}
.component-list {
  padding-left: 0;
  max-height: 300px;
  overflow: auto;
  margin: 0 -12px 0 0;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    line-height: 30px;
    &.is-select, &:hover {
      color: #409eff;
      cursor: pointer;
    }
    .component-list-label {
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.tag-list {
  margin-right: 10px;
}
</style>
