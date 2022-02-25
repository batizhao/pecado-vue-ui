<template>
  <div>
    <table-filter
      v-if="conditions"
      @query="tableQuery"
      :conditions="conditions"
      :loading="loading"
    ></table-filter>
    <slot name="actionButtons"></slot>
    <el-table
      :data="data"
      v-loading="loading"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="55"
        :index="indexMethod"
        align="center"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        v-bind="item"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope"> 
          <div v-if="item.slotName">
            <slot :name="item.slotName" :row="scope.row"></slot>
          </div>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="230" align="center">
        <template slot-scope="scope">
          <slot name="action" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="paginationSizeChange"
      @current-change="paginationCurrentChange"
      v-bind="pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getTableData } from '@/api/app/dev.js'
import tableFilter from './tableFilter.vue'
export default {
  components: {
    tableFilter
  },
  props: {
    url: String, // 请求接口路径
    columns: Array, // 表格列
    conditions: Array, // 条件筛选
    otherParams: Object // 其他参数
  },
  data () {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper'
      },
      data: [],
      loading: false,
      selectedIds: [],
      tableFilterParams: {}
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1 + (this.pagination.currentPage - 1 ) * this.pagination.pageSize
    },
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getTableData()
    },
    paginationSizeChange (pageSize) {
      this.pagination.currentPage = 1
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    getTableData () {
      const { currentPage, pageSize } = this.pagination
      const params = {
        size: pageSize,
        current: currentPage,
        ...this.tableFilterParams,
        ...this.otherParams
      }
      this.loading = true
      getTableData(this.url, params).then(res => {
        this.pagination.total = res.data.total
        this.data = res.data.records
        this.loading = false
        this.selectedIds = []
      }).catch(() => {
        this.loading = false
      })
    },
    selectionChange (data) {
      this.selectedIds = data.map(item => item.id)
    },
    getSelectedIds () {
      if (this.selectedIds.length) {
        return this.selectedIds.toString()
      } else {
        this.msgInfo('无选中数据')
      }
    },
    tableQuery (params) {
      this.pagination.currentPage = 1
      this.tableFilterParams = params
      this.getTableData()
    }
  },
  mounted () {
    this.getTableData()
  }
}
</script>

<style lang="scss">
.el-pagination {
  float: right;
  margin: 15px 0;
}
</style>
