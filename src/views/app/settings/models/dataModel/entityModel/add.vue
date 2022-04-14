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
    <action-edit-table
      ref="actionEditTableRef"
      :defaultData="tableDefaultData"
      showSelection
      :tableColumns="tableColumns"
      :readonlyCondition="isReadonly"
      :addRowIndex="-2"
    >
      <template v-slot:config="scope">
        <el-badge is-dot v-if="scope.row.config && scope.row.config.length">
          <el-button size="mini" @click="configChildren(scope)">配置</el-button>
        </el-badge>
        <el-button v-else size="mini" @click="configChildren(scope)" :disabled="scope.row.type !== 'json'">配置</el-button>
      </template>
    </action-edit-table>
    <!-- 配置弹窗 -->
    <action-dialog
      v-model="configChildrenVisible"
      title="配置集合"
      width="80%"
      @confirm="configChildrenConfirm"
    >
      <div class="mb8">
        <action-button actionType="1" @click="configChildrenAdd">新增</action-button>
        <action-button actionType="2" @click="configChildrenDel">删除</action-button>
      </div>
      <action-edit-table
        ref="configChildrenRef"
        :defaultData="configChildrenTableDefaultData"
        showSelection
        :tableColumns="configChildrenTableColumns"
      >
      </action-edit-table>
    </action-dialog>
  </div>
</template>

<script>
import { listDs } from '@/api/dp/ds.js'
const getDefaultFrom = () => {
  return {
    tableName: '', // 表名称
    tableComment: '', // 表描述
    dsName: 'master', // 数据源
    columnMetadata: '[]' // 字段定义
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
export default {
  data () {
    return {
      form: getDefaultFrom(),
      formOptions: [
        {
          label: '表名称',
          prop: 'tableName',
          disabled: false,
          rules: [
            { required: true, message: "请输入表名称", trigger: "change" },
            { validator: checkName, trigger: 'change' }
          ]
        },
        {
          label: '表描述',
          prop: 'tableComment',
          disabled: false,
          rules: [
            { required: true, message: "请输入表描述", trigger: "change" }
          ]
        },
        {
          label: '数据源',
          prop: 'dsName',
          type: 'select',
          options: [
            {
              label: '主数据源',
              value: 'master'
            }
          ],
          rules: [
            { required: true, message: "请选择数据源", trigger: "change" }
          ]
        }
      ],
      tableColumns: [
        {
          label: '字段名称',
          prop: 'name',
          rules: [
            { required: true, trigger: 'change', message: '请输入'},
            { validator: checkName, trigger: 'change' }
          ]
        },
        {
          label: '字段描述',
          prop: 'comment',
          rules: [
            { required: true, trigger: 'change', message: '请输入'}
          ]
        },
        {
          label: '字段类型',
          prop: 'type',
          type: 'select',
          rules: [
            { required: true, trigger: 'change', message: '请输入'}
          ],
          options: [],
          defaultValue: 'varchar',
          change: (value, item, index) => {
            this.$refs.actionEditTableRef.setValue(index, 'config', [])
          }
        },
        {
          label: '字段长度',
          prop: 'length',
          type: 'inputNumber',
          min: 0,
          defaultValue: 255
        },
        {
          label: '小数点位',
          prop: 'decimal',
          type: 'inputNumber',
          min: 0,
          max: 30,
          defaultValue: 0
        },
        {
          label: '主键',
          prop: 'primary',
          type: 'checkbox',
          disabled: true
        },
        {
          label: '不允许空值',
          prop: 'required',
          type: 'checkbox'
        },
        {
          label: '默认值',
          prop: 'defaultValue'
        },
        {
          label: '配置',
          prop: 'config',
          type: 'slot'
        }
      ],
      tableDefaultData: [],
      defaultFields: ['id'], // 默认字段
      currentRowIndex: null,
      configChildrenVisible: false,
      configChildrenTableColumns: [
        {
          label: 'Java属性名',
          prop: 'name',
          rules: [
            { required: true, trigger: 'change', message: '请输入'},
            { validator: checkName, trigger: 'change' }
          ]
        },
        {
          label: 'Java注释',
          prop: 'comment',
          rules: [
            { required: true, trigger: 'change', message: '请输入'}
          ]
        },
        {
          label: 'Java类型',
          prop: 'type',
          type: 'select',
          rules: [
            { required: true, trigger: 'change', message: '请输入'}
          ],
          options: [
            {
              label: '字符串',
              value: 'String'
            },
            {
              label: '数字',
              value: 'Integer'
            }
          ],
          defaultValue: 'String'
        },
        {
          label: '不允许空值',
          prop: 'required',
          type: 'checkbox'
        },
        {
          label: '默认值',
          prop: 'defaultValue'
        },
      ],
      configChildrenTableDefaultData: []
    }
  },
  watch: {
    form: {
      handler: function(val) {
        // 如果是编辑状态，使表名称和表描述输入框禁用
        this.formOptions.map(item => {
          if (['tableName', 'tableComment'].includes(item.prop)) {
            item.disabled = val.id !== undefined
          }
        })
      },
      deep: true
    }
  },
  created () {
    this.getDataSource()
    this.listDictDataByCode('db_column_type').then(res => {
      const index = this.tableColumns.findIndex(item => item.prop === 'type')
      this.tableColumns[index].options = res.data
    })
  },
  methods: {
    handleAdd () {
      this.$refs.actionEditTableRef.addRow()
    },
    handleDel () {
      this.$refs.actionEditTableRef.deleteRow(selectedItems => {
        // 判断勾选的数据中是否有默认字段，有就不能删除
        const hasDefaultFields = selectedItems.some(item => this.defaultFields.includes(item.name))
        if (hasDefaultFields) {
          this.msgError('默认字段不能删除')
          return false
        }
        return true
      })
    },
    submit () {
      const p1 = new Promise((resolve, reject) => {
        const form1 = this.$refs.actionFormRef.getRef()
        form1.validate(valid => {
          if (valid) resolve(this.form)
        })
      })
      const p2 = new Promise((resolve, reject) => {
        const ref = this.$refs.actionEditTableRef
        ref.getRef().validate(valid => {
          if (valid) resolve(ref.getData())
        })
      })
      return Promise.all([p1, p2])
    },
    reset () {
      this.$refs.actionFormRef.reset()
      this.form = getDefaultFrom()
      this.tableDefaultData = [
        {
          name: 'id',
          type: 'int',
          length: 10,
          comment: '主键',
          decimal: 0,
          primary: true,
          increment: true,
          required: false,
          defaultValue: ''
        },
        {
          name: 'name',
          type: 'varchar',
          length: 32,
          comment: '名称',
          decimal: 0,
          primary: false,
          required: false,
          defaultValue: ''
        },
        {
          name: 'createTime',
          type: 'datetime',
          length: 0,
          comment: '创建时间',
          decimal: 0,
          primary: false,
          required: false,
          defaultValue: ''
        },
        {
          name: 'updateTime',
          type: 'datetime',
          length: 0,
          comment: '修改时间',
          decimal: 0,
          primary: false,
          required: false,
          defaultValue: ''
        }
      ]
    },
    // 获取数据源列表
    getDataSource () {
      listDs({ size: 999, current: 1 }).then(res => {
        const index = this.formOptions.findIndex(item => item.prop === 'dsName')
        const records = res.data.records
        if (records) {
          const list = records.map(item => ({
            value: item.name,
            label: item.name
          }))
          this.formOptions[index].options = this.formOptions[index].options.concat(list)
        }
      })
    },
    isReadonly (row) {
      return this.defaultFields.includes(row.name)
    },
    configChildren ({row, index}) {
      this.currentRowIndex = index
      this.configChildrenTableDefaultData = JSON.parse(JSON.stringify(row.config))
      this.configChildrenVisible = true
    },
    configChildrenConfirm () {
      const ref = this.$refs.configChildrenRef
      ref.getRef().validate(valid => {
        if (valid) {
          const data = ref.getData()
          this.$refs.actionEditTableRef.setValue(this.currentRowIndex, 'config', data)
          this.configChildrenVisible = false
        }
      })
    },
    configChildrenAdd () {
      this.$refs.configChildrenRef.addRow()
    },
    configChildrenDel () {
      this.$refs.configChildrenRef.deleteRow()
    }
  }
}
</script>
