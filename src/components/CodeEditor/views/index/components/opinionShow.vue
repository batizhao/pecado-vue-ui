<template>
  <div>
    <el-form size="small" label-width="130px" label-position="left">
      <form-basic-setting>
        <el-form-item label="带有边框">
          <el-switch v-model="activeData.showBorder" />
      </el-form-item>
        <el-form-item label="是否显示行号">
          <el-switch v-model="activeData.showLineNum" />
      </el-form-item>
      <el-form-item label="是否显示复选框列">
          <el-switch v-model="activeData.showCheckBox" />
      </el-form-item>
      <el-form-item label="是否显示分页">
          <el-switch v-model="activeData.showPagination" />
      </el-form-item>
      <el-form-item label="是否斑马线">
          <el-switch v-model="activeData.showStripe" />
      </el-form-item>
      <el-form-item label="接口地址">
        <el-input v-model="activeData.url" />
      </el-form-item>
      <el-form-item label="表格列编辑">
        <el-button type="text" @click="openTable" >编辑</el-button>
      </el-form-item>
      </form-basic-setting>
    </el-form>
    <table-edit ref="child" :showDialog='tableEditShow' :activeData='activeData' @tableEdit='handleClose' @submit='handleSubmit' ></table-edit>
  </div>
</template>

<script>
import mixins from './mixins'
import formBasicSetting from './formBasicSetting.vue'
import tableEdit from './tableEdit.vue'
export default {
  mixins: [mixins],
  components: {
    formBasicSetting,
    tableEdit
  },
  data(){
    return{
      tableEditShow: false,
    }
  },
  methods:{
    handleClose(e){
      this.tableEditShow=e
    },
    handleSubmit(e){
      this.tableEditShow=e.dialog
      this.activeData.tableColumns=e.tableData
    },
    //打开表格编辑弹窗
     openTable(){
       this.tableEditShow = true
       let that=this;
      let tout=setTimeout(()=>{
            that.$refs.child.rowDrop();
      },500)
       
     }
  }
}
</script>
