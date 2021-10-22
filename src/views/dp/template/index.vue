<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24" class="tree_container">
        <div class="head-container">
          <el-input
            v-model="templateName"
            placeholder="请输入模板配置名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="templateOptions"
            :props="defaultProps"
            :expand-on-click-node="true"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
        <el-button type="primary" size="small" class="confirm" @click="confirm">提交</el-button>
      </el-col>
      <el-col :span="20" :xs="24" v-loading="loading" class="editor_container">
        <code-editor
          v-if="codeEditorShow"
          v-model="codeContent"
          language="Velocity"
          editorHeight="calc(100vh - 120px)"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listCodeTemplates, getCodeTemplate, addOrUpdateCodeTemplate } from "@/api/dp/template";
import CodeEditor from "@/components/CodeEditor/components/CodeEditor";
export default {
  name: "CodeTemplate",
  components: {
    CodeEditor,
  },
  data(){
    return {
      pageLoading:true,
      loading:false,
      // 搜索框
      templateName: '',
      // 树结构数据
      templateOptions: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 配置代码
      codeContent: '',
      // 编辑器显示状态 强制刷新重新渲染数据
      codeEditorShow: true,
      // 当前节点的Path属性
      currentPath: ''
    }
  },
  watch: {
    // 根据名称筛选模板树
    templateName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
  },
  methods:{
    /** 查询模板配置列表 */
    getList() {
      listCodeTemplates(this.queryParams).then(response => {
        this.templateOptions = response.data;
        this.pageLoading = false;
      });
    },
    // 查询模板配置参数
    getTemplate(path) {
      this.loading = true;
      this.codeEditorShow = false;
      getCodeTemplate(path).then(response => {
        this.codeContent = response.data;
        this.codeEditorShow = true
        this.loading = false;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.currentPath = data.path
      // 有子节点不调接口
      data.leaf ? this.getTemplate(data.path) : '';
    },
    // 提交更改
    confirm(){
      let params = {
        path: this.currentPath,
        codeContent: this.codeContent
      }
      addOrUpdateCodeTemplate(params).then(res =>{
        this.msgSuccess("保存成功");
      })
    }
  }
}
</script>

<style scoped  lang="scss">
.tree_container{
  height: calc(100vh - 120px);
  position: relative;
  .confirm{
    width: calc(100% - 20px);
    position: absolute;
    bottom: 0;
  }
}
.editor_container{
  height: calc(100vh - 120px);
}
::v-deep .el-tree{
  .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  /* 有子节点 且未展开 */
  .el-icon-caret-right:before {
    background: url('~@/assets/images/closeFile.svg') no-repeat 0 3px;
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    font-size: 16px;
    background-size: 16px;
  }

  /* 有子节点 且已展开 */
  .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    background: url('~@/assets/images/openFile.svg') no-repeat 0 3px;
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    font-size: 16px;
    background-size: 16px;
  }

  /* 没有子节点 */
  .el-tree-node__expand-icon.is-leaf::before {
    background: #fff;
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    font-size: 16px;
    background-size: 16px;
  }
}

</style>