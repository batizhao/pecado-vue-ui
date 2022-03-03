
<template>
  <div>
    <el-form ref="form" :model="form">
      <el-form-item>
        <el-table ref="dragTable" :data="form.columnMetadata" row-key="id" size="mini">
          <el-table-column
            label="序号"
            type="index"
            min-width="5%"
            class-name="allowDrag"
            align="center"
          />
          <el-table-column
            label="字段名称"
            prop="name"
            min-width="6%"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            label="字段描述"
            prop="comment"
            min-width="10%"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            label="字段类型"
            prop="type"
            min-width="6%"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{getTypeLabel(scope.row.type)}}
            </template>
          </el-table-column>
          <el-table-column min-width="11%" align="center">
            <template slot="header">
              <div class="red-star">Java类型</div>
            </template>
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="`columnMetadata.${$index}.javaType`" :rules="rules.javaType">
                <el-select v-model="row.javaType" size="mini">
                  <el-option label="Long" value="Long" />
                  <el-option label="String" value="String" />
                  <el-option label="Integer" value="Integer" />
                  <el-option label="Double" value="Double" />
                  <el-option label="BigDecimal" value="BigDecimal" />
                  <el-option label="Date" value="Date" />
                  <el-option label="LocalDateTime" value="LocalDateTime" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="10%" align="center">
            <template slot="header">
              <div class="red-star">Java属性</div>
            </template>
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="`columnMetadata.${$index}.javaField`" :rules="rules.javaField">
                <el-input v-model="row.javaField" size="mini"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="5%" align="center">
            <template slot="header">
              <div class="red-star">插入</div>
            </template>
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.save" size="mini" />
            </template>
          </el-table-column>
          <el-table-column min-width="5%" align="center">
            <template slot="header">
              <div class="red-star">必填</div>
            </template>
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.required" size="mini" />
            </template>
          </el-table-column>
          <el-table-column min-width="12%" align="center">
            <template slot="header">
              <div class="red-star">显示类型</div>
            </template>
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="`columnMetadata.${$index}.htmlType`" :rules="rules.htmlType">
                <el-select v-model="row.htmlType" size="mini">
                  <el-option label="单行文本" value="input" />
                  <el-option label="多行文本" value="textarea" />
                  <el-option label="下拉选择框" value="select" />
                  <el-option label="单选框" value="radio" />
                  <el-option label="多选框" value="checkbox" />
                  <el-option label="开关" value="switch" />
                  <el-option label="日期选择器" value="datetime" />
                  <el-option label="图片" value="imageUpload" />
                  <el-option label="文件" value="fileUpload" />
                  <el-option label="编辑器" value="editor" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <br/>
  </div>
</template>

<script>
export default {
  props: {
    columnMetadata: Array
  },
  data () {
    return {
      typeOptions: [],
      rules: {
        javaType: [
          { required: true, trigger: 'change', message: '请选择' }
        ],
        javaField: [
          { required: true, trigger: 'change', message: '请输入' }
        ],
        htmlType: [
          { required: true, trigger: 'change', message: '请选择' }
        ],
      },
      form: {
        columnMetadata: this.columnMetadata
      }
    }
  },
  created () {
    this.listDictDataByCode('db_column_type').then(res => {
      this.typeOptions = res.data
    })
  },
  methods: {
    getTypeLabel (val) {
      const item = this.typeOptions.find(item => item.value === val)
      return item ? item.label : val
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