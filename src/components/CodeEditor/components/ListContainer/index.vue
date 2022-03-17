<template>
  <div class="list-container" :class="{'gray-back': !url}">
    <div v-if="url">
      <action-table
        v-if="tableConfig"
        v-bind="tableConfig"
      >
        <template v-slot:action="scope">
          <el-button
            v-for="(item, index) in actionButtons"
            :key="index"
            @click="actionButtonClick(scope.row, item)"
            :icon="item.icon"
            :type="item.style"
            size="mini"
          >{{item.name}}</el-button>
        </template>
      </action-table>
    </div>
    <div class="tip" v-else>{{`列表容器 ${errorTip}`}}</div>
  </div>
</template>

<script>
import Parser from '@/components/CodeEditor/components/parser/Parser.vue'
import request from '@/utils/request'
export default {
  name: 'list-container',
  components: {
    Parser
  },
  props: {
    url: String // 请求地址
  },
  data () {
    return {
      tableConfig: null,
      actionButtons: [],
      errorTip: ''
    }
  },
  methods: {
    getData () {
      if (!this.url) return
      request({
        url:  this.url,
        method: 'get'
      }).then(res => {
        const data = res.data
        data.listMetadata = JSON.parse(data.listMetadata)
        this.tableConfig = this.getTableConfig(data)
      }).catch(err => {
        this.errorTip = err
      })
    },
    getTableConfig (data) {
      const tableConfig = {
        url: '', // 请求地址
        columns: [], // 表格列
        conditions: [], // 条件筛选
        showPagination: true, // 显示分页
        pageSize: 0, // 分页大小
        showNumber: true, // 显示行号
        showSelection: false, // 显示复选框
        operationColumn: { // 操作列设置
          show: true,
          fixed: false,
          width: 0
        }
      }
      const { header, button, condition } = data.listMetadata
      console.log("🚀 ~ file: index.vue ~ line 35 ~ getData ~ data", data)
      // 接口地址
      tableConfig.url = data.addr
      // 生成表头
      tableConfig.columns = 
        header
        .filter(item => item.display === true)
        .map(item => ({
          prop: item.code,
          label: item.name,
          minWidth: item.width,
          fixed: item.fixed,
          align: item.alignType
        }))
      // 生成筛选条件
      tableConfig.conditions = 
        condition
        .filter(item => item.display === true)
        .map(item => ({
          prop: item.code,
          label: item.name,
          componentType: 'input'
        }))
      // 显示分页
      tableConfig.showPagination = Boolean(data.page)
      // 分页大小
      tableConfig.pageSize = data.pageSize
      // 行号
      tableConfig.showNumber = Boolean(data.lineNum)
      // 操作列
      tableConfig.operationColumn = {
        show: Boolean(data.operField),
        fixed: Boolean(data.fixedOperField) ? 'right' : false,
        width: data.operFieldWidth
      }
      // 操作按钮
      this.actionButtons = button
      console.log("🚀 ~ file: index.vue ~ line 82 ~ getTableConfig ~ tableConfig", tableConfig)
      return tableConfig
    },
    actionButtonClick (row, button) {
    console.log("🚀 ~ file: index.vue ~ line 112 ~ actionButtonClick ~ row", row)
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
.list-container {
  min-height: 300px;
}
.list-container > .tip {
  text-align: center;
  line-height: 300px;
  font-size: 18px;
  color: gray;
  letter-spacing: 2px;
}
.gray-back {
  background: #dbdbdb;
}
</style>>
