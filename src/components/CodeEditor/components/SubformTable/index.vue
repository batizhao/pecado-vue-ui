<script>
export default {
  name: 'subform-table',
  render (h) {
    const scopedSlots = {}
    this.tableColumns.map(item => {
      scopedSlots[item.slotName] = (scoped) => {
        return this.$scopedSlots[item.slotName](scoped)
      }
    })
    return (
      <div>
        {
          !this.readonly 
          ? (
            <div class="mb8">
            <action-button actionType="1" size={this.tableSize} onClick={() => this.handleAdd()}>新增</action-button>
            <action-button actionType="2" size={this.tableSize} onClick={() => this.handleDel()}>删除</action-button>
          </div>
          )
          : ''
        }
        <action-edit-table
          ref={this.subformTableRefName}
          size={this.tableSize}
          tableColumns={this.tableColumns}
          showSelection={this.showSelection}
          showOrderNumber={this.showOrderNumber}
          operationColumn={this.operationColumn}
          scopedSlots={scopedSlots}
          defaultData={this.__config__.defaultValue}
          onChange={this.onChange}
        >
        </action-edit-table>
      </div>
    )
  },
  props: {
    size: String,
    columns: Array,
    showSelection: Boolean,
    showOrderNumber: Boolean,
    operationColumn: Object,
    __config__: Object,
    readonly: Boolean
  },
  data () { 
    return {
      subformTableRefName: 'subformTableRef' + Math.floor(Math.random() * 100000)
    }
  },
  computed: {
    tableColumns () {
      return this.columns.map((item, index) => {
        let rulesResult = []
        const config = this.__config__.children[index].__config__
        if (config.required !== undefined) {
          const required = { required: config.required, message: config.placeholder }
          if (Array.isArray(config.defaultValue)) {
            required.type = 'array'
          }
          required.message === undefined && (required.message = `${config.label}不能为空`)
          rulesResult.push(required)
        }
        // 其他正则校验添加
        const otherRules = config.regList.map(item => {
          item.pattern && (item.pattern = eval(item.pattern))
          return item
        })
        rulesResult = rulesResult.concat(otherRules)
        return {
          label: item.label,
          prop: item.prop,
          rules: rulesResult,
          width: item.width,
          type: this.readonly ? 'text' : 'slot',
          slotName: item.prop + index, // 用prop加索引作为插槽名，规避prop重复引发的问题
          defaultValue: config.defaultValue
        }
      })
    },
    tableSize () {
      return this.size || this.$store.state.codeEditor.components.formConf.size
    }
  },
  methods: {
    setValue (index, attrName, value) {
      this.$refs[this.subformTableRefName].setValue(index, attrName, value)
    },
    getRef () {
      return this.$refs[this.subformTableRefName].getRef()
    },
    getData () {
      return this.$refs[this.subformTableRefName].getData()
    },
    handleAdd () {
      this.$refs[this.subformTableRefName].addRow()
    },
    handleDel () {
      this.$refs[this.subformTableRefName].deleteRow()
    },
    onChange (value) {
      this.$emit('input', value)
    }
  }
}
</script>
