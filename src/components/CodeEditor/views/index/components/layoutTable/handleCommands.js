import store from '@/store'
const getCell = () => {
  return {
    __config__: {
      layout: 'tableCell',
      children: []
    },
    rowspan: 1, 
    colspan: 1
  }
}
export default {
  handleInsertLeftCol ([rowIndex, colIndex], { layoutTableData }, flag) {
    layoutTableData.map(row => {
      row.splice(colIndex + (!flag ? 0 : 1), 0, getCell())
    })
  },
  handleInsertRightCol ([rowIndex, colIndex], { layoutTableData }) {
    this.handleInsertLeftCol(...arguments, true)
  },
  handleInsertUpperRow ([rowIndex, colIndex], { layoutTableData }, flag) {
    const colNum = layoutTableData[rowIndex].length
    const arr = []
    for (let i = 1; i <= colNum; i++) {
      arr.push(getCell())
    }
    layoutTableData.splice(rowIndex + (!flag ? 0 : 1), 0, arr)
  },
  handleInsertBelowRow ([rowIndex, colIndex], { layoutTableData }) {
    this.handleInsertUpperRow(...arguments, true)
  },
  handleMergeLeftCell ([rowIndex, colIndex], { layoutTableData }, flag) {
    // 清空当前单元格，将当前单元格的colspan累加到目标单元格
    const targeIndex = !flag ? colIndex - 1 : colIndex + 1
    layoutTableData[rowIndex][targeIndex].colspan += layoutTableData[rowIndex][colIndex].colspan
    layoutTableData[rowIndex][colIndex] = null
  },
  handleMergeRightCell ([rowIndex, colIndex], { layoutTableData }) {
    this.handleMergeLeftCell(...arguments, true)
  },
  handleMergeRow ([rowIndex, colIndex], { layoutTableData }) {
    // 保留目标单元格，其他单元格全null
    const colNum = layoutTableData[rowIndex].length
    layoutTableData[rowIndex].map((item, index) =>{
      if (index === colIndex) {
        layoutTableData[rowIndex][colIndex].colspan = colNum
      } else {
        layoutTableData[rowIndex][index] = null
      }
    })
  },
  handleMergeUpperCell ([rowIndex, colIndex], { layoutTableData }, flag) {
    // 清空当前单元格，将当前单元格的rowspan累加到目标单元格
    const targeIndex = !flag ? rowIndex - 1 : rowIndex + 1
    layoutTableData[targeIndex][colIndex].rowspan += layoutTableData[rowIndex][colIndex].rowspan
    layoutTableData[rowIndex][colIndex] = null
  },
  handleMergeBelowCell ([rowIndex, colIndex], { layoutTableData }) {
    this.handleMergeUpperCell(...arguments, true)
  },
  handleMergeCol ([rowIndex, colIndex], { layoutTableData }) {
    // 保留目标单元格，其他单元格全null
    const rowNum = layoutTableData.length
    layoutTableData.map((item, index) => {
      if (index === rowIndex) {
        layoutTableData[rowIndex][colIndex].rowspan = rowNum
      } else {
        layoutTableData[index][colIndex] = null
      }
    })
  },
  handleRevokeRowMerge ([rowIndex, colIndex], { layoutTableData }) {

  },
  handleRevokeColMerge ([rowIndex, colIndex], { layoutTableData }) {
    // 求出当前单元格左侧所有单元格的colspan累计值, 这个累计值就是拆分单元格的起始索引
    let colNum = 0
    layoutTableData[rowIndex].map((item, index) => {
      if (index < colIndex && item) {
        colNum += item.colspan
      }
    })
    console.log("🚀 ~ file: handleCommands.js ~ line 77 ~ handleRevokeColMerge ~ colNum", colNum)
    const revokeNum = layoutTableData[rowIndex][colIndex].colspan // 要拆分的列数
    for (let i = 0; i < revokeNum; i ++) {
      layoutTableData[rowIndex][colNum + i] = getCell()
    }
    store.commit('codeEditor/components/changeRenderKey')

  },
  handleDeleteRow ([rowIndex, colIndex], { layoutTableData }) {
    layoutTableData.splice(rowIndex, 1)
  },
  handleDeleteCol ([rowIndex, colIndex], { layoutTableData }) {
    layoutTableData.map((item, index) => {
      layoutTableData[index].splice(colIndex, 1)
    })
  }
}