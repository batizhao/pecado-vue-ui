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
    divided: true,
    isDisabled (currentItem, [rowIndex, colIndex], { layoutTableData }) {
      // 1 目标单元格位于第一列时
      // 2 左侧单元格为null
      // 3 左侧单元格的rowspan和当前单元格rowspan不相等
      return colIndex === 0 || 
        (layoutTableData[rowIndex][colIndex - 1] === null) ||
        (currentItem.rowspan !== layoutTableData[rowIndex][colIndex - 1].rowspan)
    }
  },
  {
    label: '合并右侧单元格',
    value: 'MergeRightCell',
    isDisabled (currentItem, [rowIndex, colIndex], { layoutTableData }) {
      // 1 目标单元格位于最后一列时
      // 2 右侧单元格为null
      // 3 右侧单元格的rowspan和当前单元格rowspan不相等
      const rowLength = layoutTableData[rowIndex].length
      return (colIndex === rowLength - 1) || 
        (layoutTableData[rowIndex][colIndex + 1] === null)  || 
        (currentItem.rowspan !== layoutTableData[rowIndex][colIndex + 1].rowspan)
    }
  },
  {
    label: '合并整行',
    value: 'MergeRow',
    isDisabled (currentItem, [rowIndex, colIndex], { layoutTableData }) {
      // 1 整行单元格的rowspan只要有一个和当前单元格的rowspan不相等
      // 2 当前单元格所在行的所有单元格colspan加起来 不等于 实际的表格列数
      // 3 只有一个单元格了
      const flag1 = layoutTableData[rowIndex].some(item => item && (item.rowspan !== currentItem.rowspan))
      const currentSpanTotal = layoutTableData[rowIndex].reduce((total, current) => {
        return total + (current ? current.colspan : 0)
      }, 0)
      const tableSpanLength = layoutTableData[rowIndex].length
      const flag2 = currentSpanTotal !== tableSpanLength
      const flag3 = layoutTableData[rowIndex].filter(item => item !== null).length === 1
      return flag1 || flag2 || flag3
    }
  },
  {
    label: '合并上方单元格',
    value: 'MergeUpperCell',
    divided: true,
    isDisabled (currentItem, [rowIndex, colIndex], { layoutTableData }) {
      // 1 目标单元格位于第一行时
      // 2 上方单元格为null
      // 3 上方单元格的colspan和当前单元格的colspan不相等
      return rowIndex === 0 ||
      (layoutTableData[rowIndex - 1][colIndex] === null) ||
      (currentItem.colspan !== layoutTableData[rowIndex - 1][colIndex].colspan)
    }
  },
  {
    label: '合并下方单元格',
    value: 'MergeBelowCell',
    isDisabled (currentItem, [rowIndex, colIndex], { layoutTableData }) {
      // 1 目标单元格位于最后一行时
      // 2 下单元格为null
      // 3 下单元格的colspan和当前单元格的colspan不相等
      const colLength = layoutTableData.length
      return (rowIndex === colLength - 1) ||
      (layoutTableData[rowIndex + 1][colIndex] === null) ||
      (currentItem.colspan !== layoutTableData[rowIndex + 1][colIndex].colspan)
    }
  },
  {
    label: '合并整列',
    value: 'MergeCol',
    isDisabled (currentItem, [rowIndex, colIndex], { layoutTableData }) {
      // 1 整列单元格的colspan只要有一个和当前单元格的colspan不相等
      // 2 当前单元格所在列的所有单元格rowspan加起来 不等于 实际的表格行数
      // 3 只有一个单元格了
      const flag1 = layoutTableData.some(item => item[colIndex] && (item[colIndex].colspan !== currentItem.colspan))
      const currentSpanTotal = layoutTableData.reduce((total, current) => {
        return total + (current[colIndex] ? current[colIndex].rowspan : 0)
      }, 0)
      const tableSpanLength = layoutTableData.length
      const flag2 = currentSpanTotal !== tableSpanLength
      const flag3 = layoutTableData.filter(item => item[colIndex] !== null).length === 1
      return flag1 || flag2 || flag3
    }
  },
  {
    label: '撤销行合并',
    value: 'RevokeRowMerge',
    divided: true,
    isDisabled (currentItem) {
      // rowspan等于1
      return currentItem.rowspan === 1
    }
  },
  {
    label: '撤销列合并',
    value: 'RevokeColMerge',
    isDisabled (currentItem) {
      // colspan等于1
      return currentItem.colspan === 1
    }
  },
  {
    label: '删除整行',
    value: 'DeleteRow',
    divided: true,
    isDisabled (currentItem, [rowIndex, colIndex], { layoutTableData }) {
      // 1 整行单元格的rowspan只要有一个和当前单元格的rowspan不相等
      // 2 当前单元格所在行的所有单元格colspan加起来 不等于 实际的表格列数
      const flag1 = layoutTableData[rowIndex].some(item => item && (item.rowspan !== currentItem.rowspan))
      const currentSpanTotal = layoutTableData[rowIndex].reduce((total, current) => {
        return total + (current ? current.colspan : 0)
      }, 0)
      const tableSpanLength = layoutTableData[rowIndex].length
      const flag2 = currentSpanTotal !== tableSpanLength
      return flag1 || flag2
    }
  },
  {
    label: '删除整列',
    value: 'DeleteCol',
    isDisabled (currentItem, [rowIndex, colIndex], { layoutTableData }) {
      // 1 整列单元格的colspan只要有一个和当前单元格的colspan不相等
      // 2 当前单元格所在列的所有单元格rowspan加起来 不等于 实际的表格行数
      const flag1 = layoutTableData.some(item => item[colIndex] && (item[colIndex].colspan !== currentItem.colspan))
      const currentSpanTotal = layoutTableData.reduce((total, current) => {
        return total + (current[colIndex] ? current[colIndex].rowspan : 0)
      }, 0)
      const tableSpanLength = layoutTableData.length
      const flag2 = currentSpanTotal !== tableSpanLength
      return flag1 || flag2
    }
  },
]

function getItems (h, currentItem, index, layoutTableItem) {
  return commands.map(item => {
    return (
      <el-dropdown-item
        divided={item.divided}
        command={item.value}
        disabled={item.isDisabled ? item.isDisabled(currentItem, index, layoutTableItem) : false}
      >
        {item.label}
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
          {getItems.call(this, h, currentItem, index, layoutTableItem)}
        </el-dropdown-menu>
      </el-dropdown>
    ]
  }
}