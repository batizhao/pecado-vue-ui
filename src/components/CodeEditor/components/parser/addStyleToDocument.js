function addCSS (className, cssText) {
  // 检查指定id的样式是否存在
  const isExistStyle = document.querySelector(`style[id=${className}]`)
  let style
  if (isExistStyle) {
    style = isExistStyle
    style.innerHTML = ''
  } else {
    style = document.createElement('style') // 创建一个style元素
    style.id = className
  }
  const head = document.head || document.getElementsByTagName('head')[0] // 获取head元素
  style.type = 'text/css' // 这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
  if (style.styleSheet) {
    // IE
    const func = function () {
      try {
        // 防止IE中stylesheet数量超过限制而发生错误
        style.styleSheet.cssText = cssText
      } catch (e) {}
    }
    // 如果当前styleSheet还不能用，则放到异步中则行
    if (style.styleSheet.disabled) {
      setTimeout(func, 10)
    } else {
      func()
    }
  } else {
    // w3c浏览器中只要创建文本节点插入到style元素中就行了
    const textNode = document.createTextNode(cssText)
    style.appendChild(textNode)
  }
  head.appendChild(style) // 把创建的style元素插入到head中
}
// 驼峰转换中划线
function toLine (name) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase()
}
// 将样式数据对象转换成css字符串
function transformObjectjToString (xStyles) {
  let result = ''
  for (const key in xStyles) {
    result += `${toLine(key)}:${xStyles[key]} !important;`
  }
  return result
}

// 组件label与实际HTML元素对应关系（目前唯一能区分所有组件的唯一字段就只有label了）
const markRelations = {
  单行文本: '>input',
  密码: '>input',
  多行文本: '>textarea',
  计数器: ' .el-input>input',
  编辑器: '+div .tox-edit-area__iframe',
  下拉选择: '>.el-select>.el-input>input',
  级联选择: '>.el-input>input',
  时间选择: '>input',
  时间范围: '>input',
  上传: ' .el-upload>button',
  导航菜单: '>.el-menu',
  回到顶部: '>.el-backtop',
  轮播图: '>.el-carousel__container',
  图标: '>.icon-component',
  按钮: ' .el-button'
}
function addOneNodeStyleToDocument (item) {
  let className = 'component-style-panel-' + item.__config__.formId
  const stylesData = item.styles
  const componentTag = item.__config__.label
  if (stylesData === undefined) {
    return
  }
  const defaultStylesStr = stylesData.defaultStyles && transformObjectjToString(stylesData.defaultStyles)
  const hoverStylesStr = stylesData.hoverStyles && transformObjectjToString(stylesData.hoverStyles)
  const activeStylesStr = stylesData.activeStyles && transformObjectjToString(stylesData.activeStyles)
  const focusStylesStr = stylesData.focusStyles && transformObjectjToString(stylesData.focusStyles)
  let result = ''
  const id = className

  if (componentTag && markRelations[componentTag]) className += markRelations[componentTag]

  if (defaultStylesStr) result += `.${className}{${defaultStylesStr}}`
  if (hoverStylesStr) result += `.${className}:hover{${hoverStylesStr}}`
  if (activeStylesStr) result += `.${className}:active{${activeStylesStr}}`
  if (focusStylesStr) result += `.${className}:focus{${focusStylesStr}}`
  addCSS(id, result)
}
function addAllNodesStyleToDocument (drawingList) {
  const recursion = (list) => {
    for (const item of list) {
      addOneNodeStyleToDocument(item)
      if (item.__config__.children) {
        recursion(item.__config__.children)
      }
    }
  }
  recursion(drawingList)
}
export { addOneNodeStyleToDocument, addAllNodesStyleToDocument, addCSS }
