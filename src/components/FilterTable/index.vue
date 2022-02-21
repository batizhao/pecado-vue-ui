<template>
  <div>
    <table-filter @query="tableQuery" :conditions="conditions" :loading="loading"></table-filter>
    <el-table
      :data="data"
      class="d2-table"
      highlight-current-row
      v-loading="loading"
    >
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        v-bind="item"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="item.template" v-html="item.template(scope.row)"></div>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="230">
        <template slot-scope="scope">
          <slot name="action" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="paginationSizeChange"
      @current-change="paginationCurrentChange"
      v-bind="pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
import tableFilter from './table-filter.vue'
import api from '@/api'
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
        layout: 'prev, pager, next, sizes, jumper'
      },
      tableFilterParams: {},
      data: [],
      loading: false
    }
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getTableData()
    },
    paginationSizeChange (pageSize) {
      this.pagination.currentPage = 1
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    cellLinkClick (prop, row) {
      console.log(prop, row)
    },
    getTableData () {
      const { currentPage, pageSize } = this.pagination
      const params = {
        pageSize: pageSize,
        pageNum: currentPage,
        ...this.tableFilterParams,
        ...this.otherParams
      }
      console.log('🚀 ~ file: index.vue ~ line 91 ~ getTableData ~ params', params)
      this.loading = true
      api.getTableData(this.url, params).then(res => {
        setTimeout(() => {
          this.pagination.total = res.total
          this.data = res.records
          this.loading = false
        }, 1000)
      }).catch(() => {
        this.loading = false
      })
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
.el-table thead {
  color: #333;
}
.el-pagination__jump {
  margin-left: 0;
}
.el-pagination {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}
</style>
