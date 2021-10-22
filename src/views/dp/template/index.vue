<template>
  <div class="app-container" v-loading="pageLoading">
    <div class="action-bar">
      <el-button icon="el-icon-circle-check" type="text" @click="confirm">
        保存
      </el-button>
      <el-button icon="el-icon-view" type="text" @click="fullScreen">
        全屏
      </el-button>
      <el-button icon="el-icon-edit-outline" type="text" @click="visible = true">
        语言切换
        <el-popover
          placement="bottom"
          width="160"
          v-model="visible">
          <el-col v-for="item in modes" :key="item.value" class="modeItem" @click.native.stop="chooseMode(item)">{{item.label}}</el-col>
        </el-popover>
      </el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="4" :xs="24" class="tree_container">
        <el-tree
          :data="templateOptions"
          :props="defaultProps"
          :expand-on-click-node="true"
          ref="tree"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="20" :xs="24" v-loading="loading" class="editor_container">
        <code-editor
          ref="codeEditor"
          v-if="codeEditorShow"
          v-model="codeContent"
          language="Velocity"
          editorHeight="calc(100vh - 120px)"
          @modes="setModes"
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
      currentPath: '',
      // 选择语言提示框
      visible: false,
      // 语言数组
      modes: []
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
    },
    // 全屏
    fullScreen(){
      this.visible = false
      this.$refs.codeEditor.fullscreen()
    },
    // 子组件传来的语言数组
    setModes(val){
      this.modes = val
    },
    // 切换语言
    chooseMode(val){
      this.visible = false
      this.$refs.codeEditor.changeMode(val.value)
      this.$refs.codeEditor.mode = val.value
    }
  }
}
</script>

<style scoped  lang="scss">
.app-container{
  padding-top: 0;
}
::v-deep .action-bar{
  text-align: right;
  .el-popover{
    max-height: 200px;
    overflow-y: scroll;
    .modeItem{
      margin: 4px 0;
    }
  }
}
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