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
        <div class="mb8">
          <action-button actionType="1" onClick={() => this.handleAdd()}>新增</action-button>
          <action-button actionType="2" onClick={() => this.handleDel()}>删除</action-button>
        </div>
        <action-edit-table
          ref={this.subformTableRefName}
          tableColumns={this.tableColumns}
          showSelection={this.showSelection}
          showOrderNumber={this.showOrderNumber}
          operationColumn={this.operationColumn}
          scopedSlots={scopedSlots}
        >
        </action-edit-table>
      </div>
    )
  },
  props: {
    columns: Array,
    showSelection: Boolean,
    showOrderNumber: Boolean,
    operationColumn: Object
  },
  data () {
    return {
      subformTableRefName: 'subformTableRef' + Math.floor(Math.random() * 100000)
    }
  },
  computed: {
    tableColumns () {
      return this.columns.map((item, index) => ({
        label: item.label,
        prop: item.prop,
        rules: [], // 暂时不用
        width: item.width,
        type: 'slot',
        slotName: item.prop + index // 用prop加索引作为插槽名，规避prop重复引发的问题
      }))
    }
  },
  methods: {
    getData () {
      return this.$refs[this.subformTableRefName].getData()
    },
    handleAdd () {
      this.$refs[this.subformTableRefName].addRow()
    },
    handleDel () {
      this.$refs[this.subformTableRefName].deleteRow()
    },
  }
}
</script>
