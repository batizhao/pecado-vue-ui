import store from '@/store'
import { deepClone } from '@/utils'
const getCell = (rowspan = 1, colspan = 1) => {
  return {
    __config__: {
      layout: 'tableCell',
      children: []
    },
    rowspan, 
    colspan
  }
}
export default {
  changeRenderKey () {
    store.commit('codeEditor/components/changeRenderKey')
  },
  handleInsertLeftCol (currentItem, [rowIndex, colIndex], { layoutTableData }, flag) {
    const index = flag ? currentItem.colspan : 0
    layoutTableData.map(row => {
      row.splice(colIndex + index, 0, getCell())
    })
    this.changeRenderKey()
  },
  handleInsertRightCol (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    // 插入右侧列时要考虑当前单元格的colspan
    this.handleInsertLeftCol(...arguments, true)
  },
  handleInsertUpperRow (currentItem, [rowIndex, colIndex], { layoutTableData }, flag) {
    const index = flag ? currentItem.rowspan : 0
    const arr = []
    for (let i = 1; i <= layoutTableData[rowIndex].length; i++) {
      arr.push(getCell())
    }
    layoutTableData.splice(rowIndex + index, 0, arr)
    this.changeRenderKey()
  },
  handleInsertBelowRow (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    // 插入下方行是要考虑当前单元格的rowspan
    this.handleInsertUpperRow(...arguments, true)
  },
  handleMergeLeftCell (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    // 清空当前单元格，将当前单元格的colspan累加到目标单元格
    const targetIndex = this.findTargetCell([rowIndex, colIndex], layoutTableData, 'left')
    const targetCell = layoutTableData[targetIndex[0]][targetIndex[1]]
    const currentCell = layoutTableData[rowIndex][colIndex]
    targetCell.colspan += currentCell.colspan
    targetCell.__config__.children = targetCell.__config__.children.concat(currentCell.__config__.children)
    layoutTableData[rowIndex][colIndex] = null
    this.changeRenderKey()
  },
  handleMergeRightCell (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    // 清空目标单元格，将目标单元格的colspan累加到当前单元格 （这样做的好处是可以保证每次单元格合并后，数据是存储在左方单元格，便于后续单元格拆分）
    const targetIndex = this.findTargetCell([rowIndex, colIndex], layoutTableData, 'right')
    const targetCell = layoutTableData[targetIndex[0]][targetIndex[1]]
    const currentCell = layoutTableData[rowIndex][colIndex]
    currentCell.colspan += targetCell.colspan
    currentCell.__config__.children = currentCell.__config__.children.concat(targetCell.__config__.children)
    layoutTableData[targetIndex[0]][targetIndex[1]] = null
    this.changeRenderKey()
  },
  handleMergeRow (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    // 保留目标单元格，其他单元格全null
    const colNum = layoutTableData[rowIndex].length
    layoutTableData[rowIndex].map((item, index) =>{
      if (index === colIndex) {
        layoutTableData[rowIndex][colIndex].colspan = colNum
      } else {
        layoutTableData[rowIndex][index] = null
      }
    })
    this.changeRenderKey()
  },
  handleMergeUpperCell (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    // 合并上单元格时，清空当前单元格，将当前单元格的rowspan累加到目标单元格
    const targetIndex = this.findTargetCell([rowIndex, colIndex], layoutTableData, 'upper')
    const targetCell = layoutTableData[targetIndex[0]][targetIndex[1]]
    const currentCell = layoutTableData[rowIndex][colIndex]
    targetCell.rowspan += currentCell.rowspan
    targetCell.__config__.children = targetCell.__config__.children.concat(currentCell.__config__.children)
    layoutTableData[rowIndex][colIndex] = null
    this.changeRenderKey()
  },
  handleMergeBelowCell (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    // 合并下单元格时，清空目标单元格，将目标单元格的rowspan累加到当前单元格
    const targetIndex =  this.findTargetCell([rowIndex, colIndex], layoutTableData, 'below')
    const targetCell = layoutTableData[targetIndex[0]][targetIndex[1]]
    const currentCell = layoutTableData[rowIndex][colIndex]
    currentCell.rowspan += targetCell.rowspan
    currentCell.__config__.children = currentCell.__config__.children.concat(targetCell.__config__.children)
    layoutTableData[targetIndex[0]][targetIndex[1]] = null
    this.changeRenderKey()
  },
  handleMergeCol (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    // 保留目标单元格，其他单元格全null
    const rowNum = layoutTableData.length
    layoutTableData.map((item, index) => {
      if (index === rowIndex) {
        layoutTableData[rowIndex][colIndex].rowspan = rowNum
      } else {
        layoutTableData[index][colIndex] = null
      }
    })
    this.changeRenderKey()
  },
  handleRevokeRowMerge (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    const { colspan, rowspan } = layoutTableData[rowIndex][colIndex]
    for (let i = 0; i < rowspan; i ++) {
      layoutTableData[rowIndex + i][colIndex] = getCell(1, colspan)
    }
    this.changeRenderKey()
  },
  handleRevokeColMerge (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    const { colspan, rowspan } = layoutTableData[rowIndex][colIndex]
    for (let i = 0; i < colspan; i ++) {
      layoutTableData[rowIndex][colIndex + i] = getCell(rowspan)
    }
    this.changeRenderKey()
  },
  handleDeleteRow (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    layoutTableData.splice(rowIndex, 1)
  },
  handleDeleteCol (currentItem, [rowIndex, colIndex], { layoutTableData }) {
    layoutTableData.map((item, index) => {
      layoutTableData[index].splice(colIndex, 1)
    })
  },
  // 分别查找当前单元格上下左右的目标单元格
  findTargetCell ([rowIndex, colIndex], layoutTableData, position) {
    let targetCellIndex = null
    if (position === 'left') {
      let i = colIndex - 1
      while (i >= 0) {
        if (layoutTableData[rowIndex][i]) {
          targetCellIndex = [rowIndex, i]
          i = -1
        } else {
          i --
        }
      }
    } else if (position === 'right') {
      let i = colIndex + 1
      const colLength = layoutTableData[rowIndex].length
      while (i < colLength) {
        if (layoutTableData[rowIndex][i]) {
          targetCellIndex = [rowIndex, i]
          i = colLength
        } else {
          i ++
        }
      }
    } else if (position === 'upper') {
      let i = rowIndex - 1
      while (i >= 0) {
        if (layoutTableData[i][colIndex]) {
          targetCellIndex = [i, colIndex]
          i = -1
        } else {
          i --
        }
      }
    } else if (position === 'below') {
      let i = rowIndex + 1
      const rowLength = layoutTableData.length
      while (i < rowLength) {
        if (layoutTableData[i][colIndex]) {
          targetCellIndex = [i, colIndex]
          i = rowLength
        } else {
          i ++
        }
      }
    }
    return targetCellIndex
  }
}