<template>
  <div>
    <el-tree
      draggable
      :data="treeOptions"
      :node-key="activeData.props.props.value"
      :expand-on-click-node="false"
      :props="activeData.props.props"
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <span>
          {{ data[activeData.props.props.label] }}
        </span>
        <span class="node-operation">
          <i
            class="el-icon-plus"
            title="添加"
            @click="appendTreeItem(data)"
          ></i>
          <i
            class="el-icon-delete"
            title="删除"
            @click="removeTreeItem(node, data)"
          ></i>
        </span>
      </div>
    </el-tree>
    <div style="margin-left: 20px">
      <el-button
        icon="el-icon-circle-plus-outline"
        type="text"
        @click="addTreeItem"
      >
        添加父级
      </el-button>
      <el-button
        icon="el-icon-edit-outline"
        type="text"
        @click="editStaticData"
      >
        JSON数据
      </el-button>
    </div>
    <tree-node-dialog
      :visible.sync="treeNodeDialogVisible"
      :options="treeOptions"
      :tree-props="activeData.props.props"
      @commit="addTreeNode"
    />
  </div>
</template>

<script>
import treeNodeDialog from './TreeNodeDialog.vue'
export default {
  components: {
    treeNodeDialog
  }, 
  props: {
    activeData: Object
  },
  data () {
    return {
      treeNodeDialogVisible: false,
      currentNode: null
    }
  },
  computed: {
    treeOptions: {
      get() {
        return (
          this.activeData.options || []
        )
      },
      set(val) {
        this.activeData.options = val
      }
    }
  },
  methods: {
    changeRenderKey () {
      this.$emit('changeRenderKey')
    },
    editStaticData () {
      this.$emit('editStaticData', this.activeData.options)
    },
    addTreeItem() {
      this.treeNodeDialogVisible = true;
      this.currentNode = this.treeOptions;
    },
    appendTreeItem(data) {
      const childrenAttr = this.activeData.props.props.children;
      if (!data[childrenAttr]) {
        this.$set(data, childrenAttr, []);
      }
      this.treeNodeDialogVisible = true;
      this.currentNode = data[childrenAttr];
    },
    removeTreeItem(node, data) {
      this.activeData.__config__.defaultValue = []; // 避免删除时报错
      const childrenAttr = this.activeData.props.props.children;
      const { parent } = node;
      const children = parent.data[childrenAttr] || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    addTreeNode(data) {
      this.currentNode.push(data);
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>