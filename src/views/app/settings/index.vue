<template>
  <div class="app-setting">
    <div class="app-setting-main">
      <div class="app-setting-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/app/dev' }">应用开发</el-breadcrumb-item>
          <el-breadcrumb-item>应用配置</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.query.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="数据模型" name="1">
          <entity-model v-if="activeName === '1'"></entity-model>
        </el-tab-pane>
        <el-tab-pane label="表单模型" name="2">
          <electronic-form v-if="activeName === '2'"></electronic-form>
        </el-tab-pane>
        <el-tab-pane label="列表模型" name="5">
          <page-model v-if="activeName === '5'"></page-model>
        </el-tab-pane>
        <el-tab-pane label="流程模型" name="3">
          <process-model v-if="activeName === '3'"></process-model>
        </el-tab-pane>
        <el-tab-pane label="报表模型" name="4">
          <el-tabs v-model="activeName_4">
            <el-tab-pane label="报表部件" name="4_1">
              
            </el-tab-pane>
            <el-tab-pane label="数据集" name="4_2">
              
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="数据字典" name="6">

        </el-tab-pane>
        <el-tab-pane label="菜单配置" name="7">
          <menu-model v-if="activeName === '7'"></menu-model>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import entityModel from './models/dataModel/entityModel/index.vue'
import electronicForm from './models/formModel/electronicForm/index.vue'
import processModel from './models/processModel/index.vue'
import pageModel from './models/pageModel/index.vue'
import menuModel from './models/menuModel/index.vue'
export default {
  components: {
    entityModel,
    electronicForm,
    processModel,
    pageModel,
    menuModel
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
  .app-setting-main {
    background: #fff;
    height: 100%;
    padding: 20px 40px;
    overflow: auto;
    .app-setting-title {
      margin: 10px 0 20px 0;
    }
  }
}
</style>