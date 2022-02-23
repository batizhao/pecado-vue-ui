<template>
  <div>
    <el-table
      :data="data"
      v-loading="loading"
      border
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="55"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        v-bind="item"
        show-overflow-tooltip
      >
        <template slot-scope="scope"> 
          <div v-if="item.slotName">
            <slot :name="item.slotName" :row="scope.row"></slot>
          </div>
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
export default {
  props: {
    url: String, // 请求接口路径
    columns: Array, // 表格列
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
      selectedIds: []
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
