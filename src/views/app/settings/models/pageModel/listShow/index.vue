<template>
  <div>
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
      <el-table-column align="center">
        <template slot="header">
          <div class="red-star">列名称</div>
        </template>
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div class="red-star">列标识</div>
        </template>
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.code"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div class="red-star">列类型</div>
        </template>
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" size="mini" :disabled="isReadonly(scope.row.name)">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="对齐方式">
        <template slot-scope="scope">
          <el-select v-model="scope.row.align" size="mini" :disabled="isReadonly(scope.row.name)">
            <el-option
              v-for="item in alignType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="列宽度" align="center">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.length" :min="1"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="显示" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.primary" disabled></el-checkbox>
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
const getDefaultFrom = () => {
  return {
    tableName: '', // 表名称
    tableComment: '', // 表描述
    dsName: 'master', // 数据源
    columnMetadata: [] // 字段定义
  }
}
const checkNameReg = /^[A-Za-z][A-Za-z0-9_]{0,30}$/
const checkNameRegMsg = '只能使用字母、数字和下划线，并以字母开头，长度不超过32位'
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
export default{

  data () {
    return {
      form: getDefaultFrom(),
      alignType: [
        {
          value: 'left',
          label: '居左'
        },
        {
          value: 'center',
          label: '居中'
        },
        {
          value: 'right',
          label: '居右'
        }
      ],
      globalId: 0,
      typeOptions: [],
      defaultFields: ['id'], // 默认字段
      selectedItems: []
    }
  },
  created () {
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
      this.selectedItems = data
    },
    handleDel () {
      // 判断勾选的数据中是否有默认字段，有就不能删除
      const hasDefaultFields = this.selectedItems.some(item => this.defaultFields.includes(item.name))
      if (hasDefaultFields) {
        this.msgError('默认字段不能删除')
        return
      }
      const deleteIds = this.selectedItems.map(item => item.id)
      for (let i = this.form.columnMetadata.length - 1; i >= 0; i-- ) {
        const item = this.form.columnMetadata[i]
        if (deleteIds.includes(item.id)) {
          this.form.columnMetadata.splice(i, 1)
        }
      }
      this.selectedItems = []
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
            data = JSON.parse(JSON.stringify(this.form))
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
    isReadonly (value) {
      return this.defaultFields.includes(value)
    }
  }
}
</script>
<style scoped>
.red-star::before {
  content: '* ';
  color: red;
}
</style>