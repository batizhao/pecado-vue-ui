<template>
  <div class="list-container" :class="{'gray-back': !url}">
    <div v-if="url">
      <action-table
        ref="actionTableRef"
        v-if="tableConfig"
        v-bind="tableConfig"
      >
        <div slot="actionButtons" style="margin-bottom: 10px;">
          <el-button
            v-for="(item, index) in actionButtons"
            :key="index"
            @click="actionButtonsClick(item)"
            :icon="item.icon"
            :type="item.style"
            size="small"
          >
            {{item.name}}
          </el-button>
        </div>
        <template v-slot:action="scope">
          <el-button
            v-for="(item, index) in tableActionButtons"
            :key="index"
            @click="tableActionButtonsClick(scope.row, item)"
            :icon="item.icon"
            :type="item.style"
            size="mini"
          >
            {{item.name}}
          </el-button>
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
      tableActionButtons: [],
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
          componentType: item.showType
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
      // 表格中的操作按钮
      this.tableActionButtons = button.filter(item => item.position === 'inside')
      // 表格外的操作按钮， 如新增
      this.actionButtons = button.filter(item => item.position === 'outside')
      return tableConfig
    },
    tableActionButtonsClick (row, button) {
      // 如果有跳转链接，直接跳转
      if (button.href) {
        const href = this.analysisUrl(button.href, row)
        if (button.operType === 'edit') { // 如果是编辑，那就要把编辑接口和详情接口和方法都传过去，还要加上行数据的id
          let query = {
            formDataId: row.id,
            editUrl: this.analysisUrl(button.addr, row),
            editMethod: button.method
          }
          // 还要查一个详情接口
          const detailButton = this.tableActionButtons.find(item => item.operType === 'detail')
          if (detailButton) {
            Object.assign(query, {
              detailUrl: this.analysisUrl(button.addr, row),
              detailMethod: button.method
            })
          } else {
            this.msgError('请配置详情接口')
          }
          console.log("🚀 ~ file: index.vue ~ line 149 ~ tableActionButtonsClick ~ query", query)
          this.$router.push({ path: href, query })
        } else if (button.operType === 'detail') { // 如果是详情，就只要传详情的接口和方法
          const query = {
            detailUrl: this.analysisUrl(button.addr, row),
            detailMethod: button.method
          }
          this.$router.push({ path: href, query })
        } else {
          this.$router.push({ path: href })
        }
      } else if (button.addr) {
        // 有接口就调接口,但是要解析一下
        const url = this.analysisUrl(button.addr, row)
        request({
          url: url,
          method: button.method || 'get'
        }).then(() => {
          // 如果是删除类型按钮，就重新请求表格
          if (button.operType === 'delete') {
            this.$refs.actionTableRef.getTableData()
          }
        })
      }
    },
    actionButtonsClick (button) {
      // 如果有跳转链接，直接跳转
      if (button.href) {
        // 如果是新增，就要把新增的接口传过去
        if (button.operType === 'create') {
          const query = {
            createUrl: button.addr,
            createMethod: button.method
          }
          this.$router.push({ path: button.href, query })
        } else {
          this.$router.push({ path: button.href })
        }
      } else if (button.addr) {
        // 有接口就调接口
        request({
          url: button.addr,
          method: button.method || 'get'
        })
      }
    },
    analysisUrl (url, row) {
      // 匹配花括号中的属性名
      const result = url.match(/{[^{}]+}/g)
      if (result) {
        result.map(res => {
          url = url.replace(res, row[res.match(/{(.+)}/)[1]])
        })
      }
      return url
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
