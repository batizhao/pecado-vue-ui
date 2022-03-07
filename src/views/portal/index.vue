<template>
  <div class="app-container">
    <el-form
      :inline="true"
      ref="searchForm"
      :model="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="门户名称">
        <el-input
          v-model="formInline.user"
          placeholder="门户名称"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          icon="el-icon-search"
          size="small"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('searchForm')" size="small"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row>
      <el-button
        type="primary"
        @click="handleAdd"
        icon="el-icon-plus"
        size="small"
        >新增</el-button
      >
      <el-button @click="handleDeleteAll" icon="el-icon-delete" size="small"
        >删除</el-button
      >
    </el-row>
    <el-row style="padding-top: 20px">
      <el-table
        :data="tableData"
        border
        align="center"
        header-align="center"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="name" label="门户名称"> </el-table-column>
        <el-table-column prop="name" label="门户编码">
        </el-table-column>
        <el-table-column prop="name" label="是否默认配置">
        </el-table-column>
        <el-table-column prop="address" label="操作" width="180">
          <el-button type="text" @click="handleEdit()">编辑</el-button>
          <el-button type="text" @click="handleDesign()">设计</el-button>
          <el-button type="text">授权</el-button>
          <el-button type="text" @click="handleDelete()">删除</el-button>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="pagination">
      <el-pagination layout="prev, pager, next" :total="1000"> </el-pagination>
    </el-row>
    <!-- 新增、编辑弹窗 -->
    <el-dialog
      :title="editStatus==1?'新增':'编辑'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="门户名称：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="门户编码：">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="是否默认门户：">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设计 -->
    <Design :visible="designVisible"  @close="designClose"/>
  </div>
</template>

<script>
import Design from './design'
export default {
  name: '',
  components: {
    Design
  },
  props: {},
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      formInline: {
        user: '',
        region: ''
      },
      form: {
        name:'',
        code:'',
        status:1
      },
      rules:{
        name: [
          { required: true, message: '请输入门户名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入门户编码', trigger: 'blur' }
        ]
      },
      designVisible:false,
      currentItem:null,
      editStatus:1,
      multipleSelection:[],
      dialogVisible:false
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleAdd(){
      this.editStatus = 1
      this.dialogVisible= true
    },
    handleEdit(){
      this.editStatus=0
      this.dialogVisible= true
    },
    handleDesign(item){
      this.designVisible= true
      this.currentItem = item
    },
    designClose(){
      this.designVisible= false
    },
    handleDeleteAll(){},
    handleDelete(key){

    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  display: flex;
  padding: 20px;
}
.pagination {
  padding-top: 12px;
  text-align: right;
}

</style>
