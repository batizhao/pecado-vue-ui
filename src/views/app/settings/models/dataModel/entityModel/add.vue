<template>
  <div>
    <action-form
      :model="form"
      :formOptions="formOptions"
      :span="8"
      label-width="70px"
      ref="actionFormRef"
    ></action-form>
    <div class="mb8">
      <action-button actionType="1" @click="handleAdd">新增</action-button>
      <action-button actionType="2" @click="handleDel">删除</action-button>
    </div>
    <el-table
      :data="form.columnMetadata"
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
      <el-table-column label="字段名称" :render-header="renderHeader" align="center">
        <template slot-scope="scope">
          <span v-if="isReadonly(scope.row.name)">{{scope.row.name}}</span>
          <el-input v-else size="mini" v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="字段描述" :render-header="renderHeader" align="center">
        <template slot-scope="scope">
          <span v-if="isReadonly(scope.row.name)">{{scope.row.comment}}</span>
          <el-input v-else size="mini" v-model="scope.row.comment"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="字段类型" :render-header="renderHeader" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" size="mini" :disabled="isReadonly(scope.row.name)">
            <el-option label="字符串" value="VARCHAR"></el-option>
            <el-option label="数字型" value="INT"></el-option>
            <el-option label="日期" value="DATETIME"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="字段长度" align="center">
        <template slot-scope="scope">
          <span v-if="isReadonly(scope.row.name)">{{scope.row.length}}</span>
          <el-input-number v-else size="mini" v-model="scope.row.length" :min="1"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="小数点位" align="center">
        <template slot-scope="scope">
          <span v-if="isReadonly(scope.row.name)">{{scope.row.decimal}}</span>
          <el-input-number v-else size="mini" v-model="scope.row.decimal" :min="0" :max="30"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="主键" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.primary" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="不允许空值" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.required" :disabled="isReadonly(scope.row.name)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="默认值" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.defaultValue" v-if="!isReadonly(scope.row.name)"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listDs } from '@/api/dp/ds.js'
const getDefaultFrom = () => {
  return {
    tableName: '', // 表名称
    tableComment: '', // 表描述
    dsName: '', // 数据源
    columnMetadata: [] // 字段定义
  }
}
const checkNameReg = /^[a-z][a-z_]{0,30}$/
const checkNameRegMsg = '只能使用小写字母和下划线，并以字母开头，长度不超过32位'
const keywords = 'abstract,assert,boolean,break,byte,case,catch,char,class,const,continue,default,do,double,else,enum,extends,final,finally,float,for,goto,if,implements,import,instanceof,int,interface,long,native,new,package,private,protected,public,return,short,static,strictfp,super,switch,synchronized,this,throw,throws,transient,try,void,volatile,while'
const keywordsArr = keywords.split(',')
const checkName = (rule, value, callback) => {
  if (!checkNameReg.test(value)) {
    callback(new Error(checkNameRegMsg));
  } else if (keywordsArr.includes(value)) {
    callback(new Error('不能使用关键字'))
  } else {
    callback()
  }
}
export default {
  data () {
    return {
      form: getDefaultFrom(),
      formOptions: [
        {
          label: '表名称',
          prop: 'tableName',
          rules: [
            { required: true, message: "请输入表名称", trigger: "blur" },
            { validator: checkName, trigger: 'blur' }
          ]
        },
        {
          label: '表描述',
          prop: 'tableComment',
          rules: [
            { required: true, message: "请输入表描述", trigger: "blur" }
          ]
        },
        {
          label: '数据源',
          prop: 'dsName',
          type: 'select',
          options: [],
          optionsProps: {
            label: 'name',
            value: 'name'
          }
        }
      ],
      globalId: 0,
      typeOptions: [],
      defaultFields: ['id'] // 默认字段
    }
  },
  created () {
    this.getDataOrigin()
    this.listDictDataByCode('db_column_type').then(res => {
      this.typeOptions = res.data
    })
  },
  methods: {
    indexMethod (index) {
      return index + 1
    },
    handleAdd () {
      this.form.columnMetadata.push({
        id: this.globalId,
        name: '',
        comment: '',
        type: 'VARCHAR',
        length: 255,
        decimal: 0,
        primary: false,
        required: false,
        defaultValue: null
      })
      this.globalId ++
    },
    selectionChange (data) {
      this.deleteIds = data.map(item => item.id)
    },
    handleDel () {
      for (let i = this.form.columnMetadata.length - 1; i >= 0; i-- ) {
        const item = this.form.columnMetadata[i]
        if (this.deleteIds.includes(item.id)) {
          this.form.columnMetadata.splice(i, 1)
        }
      }
      this.deleteIds = []
    },
    submit () {
      let data = null
      const form = this.$refs.actionFormRef.getRef()
      form.validate(valid => {
        if (valid) {
          // js校验下字段名称描述是否为空
          const hasNull = this.form.columnMetadata.some(item => {
            return !item.name || !item.comment 
          })
          if (!hasNull) {
            data = this.form
          } else {
            this.msgError('请填写完整')
            return
          }
          // js校验字段名称是否符合规范
          for (let item of this.form.columnMetadata) {
            if (!checkNameReg.test(item.name)) {
              this.msgError(`字段名 ${item.name} 不符合规范：${checkNameRegMsg}`)
              data = null
              return
            }
            if (keywordsArr.includes(item.name)) {
              this.msgError(`字段名 ${item.name} 不符合规范：不能使用关键字`)
              data = null
              return
            }
          }

        }
      })
      return data
    },
    reset () {
      this.$refs.actionFormRef.reset()
      this.form = getDefaultFrom()
      this.form.columnMetadata = [
        {
          name: 'id',
          type: 'INT',
          length: 10,
          comment: '主键',
          decimal: 0,
          primary: true,
          required: true,
          increment: true,
          defaultValue: null
        },
      ]
    },
    // 获取数据源列表
    getDataOrigin () {
      listDs({ size: 999, current: 1 }).then(res => {
        const index = this.formOptions.findIndex(item => item.prop === 'dsName')
        this.formOptions[index].options = res.data.records || []
      })
    },
    renderHeader (h, { column }) {
      console.log(column);
      return <div><span style="color: red;">* </span>{column.label}</div>
    },
    isReadonly (value) {
      return this.defaultFields.includes(value)
    }
  }
}
</script>
