<template>
  <div class="app-setting">
    <div class="app-setting-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="数据模型" name="1">
          <el-tabs v-model="activeName_1">
            <entity-model></entity-model>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="表单模型" name="2">
          <el-tabs v-model="activeName_2">
            <el-tab-pane label="电子表单" name="2_1">
              
            </el-tab-pane>
            <el-tab-pane label="注册表单" name="2_2">
              
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="流程模型" name="3">

        </el-tab-pane>
        <el-tab-pane label="报表模型" name="4">
          <el-tabs v-model="activeName_4">
            <el-tab-pane label="报表部件" name="4_1">
              
            </el-tab-pane>
            <el-tab-pane label="数据集" name="4_2">
              
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="页面模型" name="5">

        </el-tab-pane>
        <el-tab-pane label="数据字典" name="6">

        </el-tab-pane>
        <el-tab-pane label="菜单配置" name="7">

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import entityModel from './models/dataModel/entityModel/index.vue'
export default {
  components: {
    entityModel
  },
  data () {
    return {
      activeName: '1',
      activeName_1: '1_1',
      activeName_2: '2_1',
      activeName_4: '4_1'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-setting {
  height: 100%;
  background: #f0f2f5;
  padding: 15px;
  .app-setting-main {
    background: #fff;
    height: 100%;
    padding: 20px 40px;
    overflow: auto;
  }
}
</style>