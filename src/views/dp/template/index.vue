<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
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
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24" v-loading="loading">
        <code-editor v-model="codeContent" language="Velocity" editorHeight="calc(100vh - 120px)"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor/components/CodeEditor";
export default {
  name: "CodeTemplate",
  components: {
    CodeEditor,
  },
  data(){
    return {
      loading:false,
      // 搜索框
      templateName: '',
      // 树结构数据
      templateOptions:[],
      defaultProps: {
        children: "children",
        label: "name"
      },
      // 配置代码
      codeContent: ''
    }
  },
  watch: {
    // 根据名称筛选模板树
    templateName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created(){
    // 查询树结构
  },
  methods:{
    // 查询模板配置参数
    getTemplate() {
      this.loading = true;

    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      // this.queryParams.departmentId = data.id;
      this.getTemplate();
    },
  }
}
</script>

<style>

</style>