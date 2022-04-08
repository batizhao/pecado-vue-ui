import handleCommands from './handleCommands.js'
const commands = [
  {
    label: '插入左侧列',
    value: 'InsertLeftCol'
  },
  {
    label: '插入右侧列',
    value: 'InsertRightCol'
  },
  {
    label: '插入上方行',
    value: 'InsertUpperRow'
  },
  {
    label: '插入下方行',
    value: 'InsertBelowRow'
  },
  {
    label: '合并左侧单元格',
    value: 'MergeLeftCell',
    divided: true
  },
  {
    label: '合并右侧单元格',
    value: 'MergeRightCell'
  },
  {
    label: '合并整行',
    value: 'MergeRow'
  },
  {
    label: '合并上方单元格',
    value: 'MergeUpperCell',
    divided: true
  },
  {
    label: '合并下方单元格',
    value: 'MergeBelowCell'
  },
  {
    label: '合并整列',
    value: 'MergeCol'
  },
  {
    label: '删除整列',
    value: 'DeleteCol',
    divided: true
  },
  {
    label: '删除整行',
    value: 'DeleteRow'
  },
]

function getItems (h, index) {
  return commands.map(item => {
    return (
      <el-dropdown-item divided={item.divided} command={item.value}>
        {item.label} {index}
      </el-dropdown-item>
    )
  })
}
export default {
  layoutTableButtons () {

  },
  tableTdButtons (h, currentItem, index, layoutTableItem) {
    return [
      <el-dropdown 
        size="mini"
        trigger="click"
        onCommand={
          val => {
            if (handleCommands['handle' + val]) {
              handleCommands['handle' + val](index, layoutTableItem)
            } else {
              alert('事件未定义')
            }
          }
        }
        >
        <span class="el-dropdown-link">
          <i class="el-icon-menu"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          {getItems.call(this, h, index)}
        </el-dropdown-menu>
      </el-dropdown>
    ]
  }
}