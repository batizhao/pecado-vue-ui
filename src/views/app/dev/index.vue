<template>
  <div class="app-dev">
    <div class="app-dev-main">
      <div class="app-dev-buttons mb8">
        <action-button @click="handleAdd">创建应用</action-button>
      </div>
      <div class="app-dev-tabs">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="'全部' + '(' + appList.length + ')'" name="all"></el-tab-pane>
          <template v-for="item in appTypeList">
            <el-tab-pane :key="item.id" :label="item.name + '(' + item.appCount + ')'" :name="String(item.id)"></el-tab-pane>
          </template>
        </el-tabs>
      </div>
      <ul class="app-dev-list">
        <li
          class="app-dev-item"
          v-for="item in appListFilter"
          :key="item.id"
          @click="toAppSettings(item.id)"
        >
          <div class="icon" :style="{ background: item.background || 'gray' }">
            <i :class="item.icon"></i>
          </div>
          <span class="title" :title="item.name">{{item.name}}</span>

          <el-dropdown size="small" @command="commandChange" @visible-change="visibleChange(item)">
            <span class="el-dropdown-link">
              <i class="el-icon-setting setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">设置应用</el-dropdown-item>
              <el-dropdown-item command="del">删除应用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>

    <!-- 添加或编辑应用对话框 -->
    <action-dialog v-model="open" :title="title" :loading="submitLoading" @confirm="submitForm">
      <action-form ref="actionFormRef" :model="form" :formOptions="formOptions">
        <template slot="icon">
          <el-input v-model="form.icon">
            <el-button slot="append" icon="el-icon-search" @click="$refs.fontAwesomeSelectorRef.open()"></el-button>
          </el-input>
          <font-awesome-selector ref="fontAwesomeSelectorRef" v-model="form.icon"></font-awesome-selector>
        </template>
        <template slot="background">
          <el-color-picker v-model="form.background"></el-color-picker>
        </template>
      </action-form> 
    </action-dialog>
  </div>
</template>

<script>
import { listAppTypes } from '@/api/app/type.js'
import { addOrUpdateApp, listApp, deleteApp, getApp } from '@/api/app/dev.js'
import FontAwesomeSelector from '@/components/FontAwesomeSelector/index.vue'
const getDefaultFrom = () => {
  return {
    name: '',
    code: '',
    typeId: '',
    description: '',
    icon: '',
    background: '',
    sort: 0
  }
}
export default {
  components: { FontAwesomeSelector },
  data () {
    return {
      appList: [],
      appTypeList: [],
      activeName: 'all',
      appTypeId: '',
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: getDefaultFrom(),
      submitLoading: false,
      formOptions: [
        {
          label: '名称',
          prop: 'name',
          rules: [
            { required: true, message: "请输入名称", trigger: "blur" }
          ]
        },
        {
          label: '编码',
          prop: 'code',
          rules: [
            { required: true, message: "请输入编码", trigger: "blur" }
          ]
        },
        {
          label: '分类',
          prop: 'typeId',
          type: 'select',
          options: [],
          optionsProps: {
            label: 'name',
            value: 'id'
          },
          rules: [
            { required: true, message: "请选择分类", trigger: "change" }
          ]
        },
        {
          label: '描述',
          prop: 'description',
          type: 'textarea'
        },
        {
          label: '图标',
          prop: 'icon',
          type: 'slot',
          rules: [
            { required: true, message: "请选择图标", trigger: "change" }
          ]
        },
        {
          label: '背景颜色',
          prop: 'background',
          type: 'slot',
          rules: [
            { required: true, message: "请选择背景颜色", trigger: "change" }
          ]
        },
        {
          label: '排序',
          prop: 'sort',
          type: 'inputNumber'
        }
      ]
    }
  },
  computed: {
    appListFilter () {
      return this.activeName !== 'all' 
        ? this.appList.filter(item => String(item.typeId) === this.activeName)
        : this.appList
    }
  },
  async created () {
    await this.getAppList() // 先获取所有app再计算每个分类有几个app
    this.getAppTypeList()
  },
  methods: {
    // 获取分类
    getAppTypeList () {
      listAppTypes().then(res => {
        if (res.data) {
          this.appTypeList = res.data.records
          this.setAppCount()

          const formOptionsItem = this.formOptions.find(item => item.prop === 'typeId')
          formOptionsItem.options = this.appTypeList
        }
      })
    },
    // 设置分类的app数量
    setAppCount () {
      this.appTypeList.map(item => {
        item.appCount = this.appList.filter(app => app.typeId === item.id).length
      })
    },
    // 获取应用列表
    getAppList () {
      listApp().then(res => {
        res.data && (this.appList = res.data)
      })
    },
    /** 添加按钮操作 */
    handleAdd() {
      this.open = true;
      this.form = getDefaultFrom()
      this.$nextTick(() => {
        this.title = "添加应用"
        this.$refs.actionFormRef.reset() // 要先打开弹窗才重置表单
      })
    },
    /** 编辑按钮操作 */
    handleUpdate() {
      this.open = true;
      this.$nextTick(() => {
        this.title = "编辑应用";
        this.form = JSON.parse(JSON.stringify(this.currentApp))
      })
    },
    // 删除应用
    async deleteApp () {
      await this.$confirm(`确定删除${this.currentApp.name}?`, '提示', {
          type: 'warning'
        })
        await deleteApp(this.currentApp.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const index = this.appList.findIndex(item => item.id === this.currentApp.id)
        this.appList.splice(index, 1)
        this.setAppCount()
    },
    /** 提交按钮 */
    submitForm() {
      const form = this.$refs.actionFormRef.getRef()
      form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          addOrUpdateApp(this.form).then(() => {
            this.msgSuccess("保存成功");
            this.open = false;
            this.submitLoading = false
            this.getAppList()
          }).catch(() => {
            this.submitLoading = false
          })
        }
      });
    },
    // 设置
    async commandChange (command) {
      if (command === 'edit') {
        this.handleUpdate()
      } else if (command === 'del') {
        this.deleteApp()
      }
    },
    visibleChange (item) {
      this.currentApp = item
    },
    // 配置应用
    toAppSettings (appId) {
      this.$router.push({
        path: '/app/settings'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$iconSize: 80px;
.app-dev {
  height: 100%;
  background: #f0f2f5;
  padding: 15px;
  .app-dev-main {
    background: #fff;
    height: 100%;
    padding: 20px;
  }
  .app-dev-list {
    display: flex;
    flex-wrap: wrap;
    .app-dev-item {
      height: 150px;
      width: 136px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      position: relative;
      &:hover {
        background: #f5f5f5;
        .setting {
          display: block;
        }
      }
      .icon {
        text-align: center;
        height: $iconSize;
        width: $iconSize;
        line-height: $iconSize;
        border-radius: 18px;
        font-size: 34px;
        color: #fff;
      }
      .title {
        text-align: center;
        font-size: 14px;
        margin-top: 15px;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
      .setting {
        color: #5b5b5b;
        display: none;
        font-size: 16px;
      }
      .el-dropdown {
        position: absolute;
        left: 5px;
        top: 5px;
      }
    }
  }
}
</style>