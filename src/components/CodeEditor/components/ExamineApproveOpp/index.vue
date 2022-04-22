<template>
  <div class="opinion-show">
    <div slot="header" class="">
      <span class="headerTitle">审批意见</span>
    </div>
    <el-divider></el-divider>
    <div class="tableBox">
      <action-table
        ref="actionTableRef"
        :showStripe="showStripe"
        :url="url"
        :showBorder="showBorder"
        :columns="tableColumns"
        :showSelection="showCheckBox"
        :showNumber="showLineNum"
        :showPagination="showPagination"
        :operationColumn="{show:false}"
      ></action-table>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "opinion-show",
  components: {},
  props: {
    url: String,
    showLineNum: Boolean,
    showCheckBox: Boolean,
    showStripe: Boolean,
    showBorder: Boolean,
    showPagination: Boolean,
    tableColumns: Array,
    alignment: String,
  },
  data() {
    return {
      tableData: [],
    };
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.opinion-show {
  padding: 10px 0;
  border: 1px solid #e6e6e6;
  box-sizing: border-box;
  .headerTitle {
    margin-left: 10px;
    font-weight: 600;
  }
  .tableBox {
    margin: 0 10px;
  }
}

::v-deep .el-divider--horizontal {
  margin: 10px 0;
}
::v-deep .cell {
  text-align: center;
}
</style>
