<template>
  <div>
    <el-dialog
      title="表格列编辑"
      :visible.sync="dialog"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="50%"
      @close="handleClose"
    >
    <div class="tableBox">
      <el-table ref="dragTable"  :data="tableData" style="width: 100%;cursor: move" border row-key="id" >
        <el-table-column type="index" width="50" fixed="left">
        </el-table-column>
        <el-table-column width="50" class-name="sortable-ghost">
          <i class="el-icon-s-operation" ></i>
        </el-table-column>
        <el-table-column label="字段名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.prop" clearable size="mini">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="显示名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label" clearable size="mini">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="列宽(px)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.colWidth" clearable size="mini">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="是否排序" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.ifSort"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否固定" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.ifFixed"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="对齐方式">
          <template slot-scope="scope">
            <el-select v-model="scope.row.alignment" placeholder="请选择">
              <el-option
                v-for="(item, index) in ['left', 'center', 'right']"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-plus"
              circle
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-minus"
              circle
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sortable from "sortablejs";
export default {
  name: "tableEdit",
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    activeData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      dialog: false,
      tableData: []
    };
  },
  watch: {
    showDialog(val) {
      this.dialog = val;
    },
    activeData(val){
      this.tableData = val.tableColumns;
    }
  },
  created() {
    this.dialog = this.showDialog;
    this.tableData = this.activeData.tableColumns;
  },
  mounted () {
   //这里我是在mounted中调用了拖拽方法，一般获取到表格数据后nextTick中就可以调用拖拽方法
    // this.rowDrop()
  },
  methods: {
    //增加一行
    handleEdit(index, row) {
      this.tableData.push({
        prop: "",
        label: "",
        colWidth: "",
        ifShow: false,
        ifSort: false,
        ifFixed: false,
        alignment: "",
      });
    },
    //删除一行
    handleDelete(index, row) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
      } else {
        this.$message({
          message: "表格只有一列时不可删除.",
          type: "warning",
        });
      }
    },
    //关闭弹框
    handleClose() {
      this.dialog = false;
      this.$emit("tableEdit", this.dialog);
    },
    //提交
    handleSubmit() {
      this.dialog = false;
      this.$emit("submit", { dialog: this.dialog, tableData: this.tableData });
    },
    // 行拖拽
    rowDrop() {
      const tbody = this.$refs.dragTable.$el.querySelector(".tableBox .el-table__body-wrapper tbody");
      const selft = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          let tData = JSON.parse(JSON.stringify(selft.tableData));
          const currRow = tData.splice(oldIndex, 1)[0];
          tData.splice(newIndex, 0, currRow);
          selft.tableData = [];
          setTimeout(() => {
            selft.tableData = tData;
          }, 5);
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  width: 80% !important;
}
</style>