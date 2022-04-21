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
      errorTip: '',
      requestUrl: '', // 请求地址
      currentPath: this.$route.path // 当前路由地址
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
      tableConfig.url = data.addr + 's'
      this.requestUrl = data.addr
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
    // 表格内按钮点击事件
    tableActionButtonsClick (row, button) {
      if (['edit', 'detail'].includes(button.operType)) {
        if (button.page && button.page.appPageCode) {
          // 如果配置了关联页面，直接跳转，带上数据id
          this.$router.push({
            path: this.currentPath,
            query: {
              id: this.$route.query.id,
              ...button.page,
              formDataId: row.id,
              operType: button.operType,
              url: this.requestUrl
            }
          })
          this.appendBreadcrumbNames(button.name)
        } else {
          this.msgError('请配置关联页面')
        }
      } else {
        // 根据按钮类型执行对应固定事件
        switch (button.operType) {
          case 'delete':
            this.handleDelete(row)
            break
          default:
            console.error('按钮类型未开发对应事件')
            break
        }
      }
    },
    // 表格外按钮点击事件
    actionButtonsClick (button) {
      if (['create'].includes(button.operType)) {
        if (button.page && button.page.appPageCode) {
          this.$router.push({
            path: this.currentPath,
            query: {
              id: this.$route.query.id,
              ...button.page,
              operType: button.operType,
              url: this.requestUrl
            }
          })
          this.appendBreadcrumbNames(button.name)
        } else {
          this.msgError('请配置关联页面')
        }
      } else {
        // 根据按钮类型执行对应固定事件
        switch (button.operType) {
          default:
            console.error('按钮类型未开发对应事件')
            break
        }
      }
    },
    handleDelete (row) {
      this.$confirm('确认删除?', "提示", {
        type: "warning"
      }).then(() => {
        request({
          url: this.requestUrl,
          method: 'delete',
          params: {
            ids: row.id
          }
        }).then(() => {
          this.msgSuccess("删除成功")
          this.$refs.actionTableRef.getTableData()
        })
      }).catch(() => {})
    },
    // 添加面包屑导航
    appendBreadcrumbNames (name) {
      this.$store.commit('codeEditor/breadcrumb/appendBreadcrumbNames', {
        name,
        search: location.search
      })
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
