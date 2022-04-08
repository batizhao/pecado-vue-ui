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
    const colNum = layoutTableData[rowIndex].reduce((total, current) => {
      return total + current.colspan
    }, 0)
    const arr = []
    for (let i = 1; i <= colNum; i++) {
      arr.push(getCell())
    }
    layoutTableData.splice(rowIndex + (!flag ? 0 : 1), 0, arr)
  },
  handleInsertBelowRow ([rowIndex, colIndex], { layoutTableData }) {
    this.handleInsertUpperRow(...arguments, true)
  }
}