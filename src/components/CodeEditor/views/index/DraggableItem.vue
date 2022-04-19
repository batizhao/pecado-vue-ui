<script>
import draggable from 'vuedraggable'
import render from '../../components/render/render'
import layoutTableButtons from './components/layoutTable/layoutTableButtons.js'

const components = {
  itemBtns(h, currentItem, index, list) {
    const { copyItem, deleteItem } = this.$listeners
    return [
      <span class="drawing-item-copy" title="复制" onClick={event => {
        copyItem(currentItem, list); event.stopPropagation()
      }}>
        <i class="el-icon-copy-document" />
      </span>,
      <span class="drawing-item-delete" title="删除" onClick={event => {
        deleteItem(index, list); event.stopPropagation()
      }}>
        <i class="el-icon-delete" />
      </span>
    ]
  }
}
const layouts = {
  // 所有表单类填写组件用此布局
  colFormItem(h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    return (
      <el-col
        span={config.span}
        style={config.span === 0 && { width: 'auto', display: 'block' }}
        class={className}
        nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}
      >
        <el-form-item
          label-width={labelWidth}
          label={config.showLabel ? config.label : ''}
          required={config.required}
        >
          <render
            key={config.renderKey}
            conf={currentItem}
            onInput={ event => {
              this.$set(config, 'defaultValue', event)
            }}
          >
            {child}
          </render>
        </el-form-item>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  },
  // 行容器组件用此布局
  rowFormItem(h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const className = this.activeId === config.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (currentItem.type === 'flex') {
      child = <el-row type={currentItem.type} justify={currentItem.justify} align={currentItem.align}>
        {child}
      </el-row>
    }
    return (
      <el-col span={config.span} class={className}>
        <el-row
          gutter={config.gutter}
          nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}
        >
          <span class="component-name">{config.componentName}</span>
          <draggable
            list={config.children || []}
            animation={340}
            group="componentsGroup"
            class={'drag-wrapper flex-start-wrap component-style-panel-' + config.formId}
          >
            {child}
          </draggable>
        </el-row>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  },
  // 自定义组件如表格、文本等用此布局
  native (h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    return (
      <el-col
        span={config.span}
        style={config.span === 0 && { width: 'auto', display: 'block' }}
        class={className}
        nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}
      >
        <render key={config.renderKey} conf={currentItem}></render>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  },
  // 表单容器用此布局
  parse(h, currentItem, index, list) {
    const config = currentItem.__config__
    const { activeItem } = this.$listeners
    const className = this.activeId === config.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item'
    return (
      <el-col
        span={config.span}
        class={className}
        nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}
      >
        <form-container url={currentItem.url}></form-container>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  },
  // 表格布局
  table(h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    const layoutTableData = currentItem.layoutTableData
    const getTds = () => {
      return layoutTableData.map((tr, trIndex) => {
        const trNode = <tr></tr>
        trNode.children = tr.map((td, tdIndex) => {
          return layouts.tableCell.call(this, h, td, [trIndex, tdIndex], currentItem)
        })
        return trNode
      })
    }
    return (
      <el-col
        span={config.span}
        style={config.span === 0 && { width: 'auto', display: 'block' }}
        class={className}
        nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}
      >
        <table class="layout-table" style="width: 100%; table-layout: fixed;">
          <tbody>
          {getTds()}
          </tbody>
        </table>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  },
  // 单元格
  tableCell(h, currentItem, index, layoutTableItem) {
    if (!currentItem) {
      return h('', {})
    }
    const child = renderChildren.apply(this, arguments)
    const config = currentItem.__config__
    return (
      <table-td
        rowspan={currentItem.rowspan}
        colspan={currentItem.colspan}
      >
        <draggable
          list={config.children || []}
          animation={340}
          group="componentsGroup"
           class="drag-wrapper flex-start-wrap"
        >
          {child}
        </draggable>
        {layoutTableButtons.tableTdButtons.apply(this, arguments)}
      </table-td>
    )
  },
  // 子表单布局
  subformTable (h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    const componentScopedSlots = {}
    const subformTableLayoutRefName = 'subformTableLayoutRef' + Math.floor(Math.random() * 100000)
    currentItem.columns.map((item, cIndex) => {
      const child = config.children[cIndex]
      componentScopedSlots[item.prop + cIndex] = (scoped) => {
        const childClassName = this.activeId === child.__config__.formId ? 'drawing-item active-from-item' : 'drawing-item'
        return h('div', {
          class: childClassName,
          style: {
            padding: '5px'
          },
          on: {
            click: (event) => {
              activeItem(child)
              event.stopPropagation()
            }
          }
        }, [
          h('render', {
            props: {
              key: child.renderKey,
              conf: child,
              subformTableDefaultValue: {
                scoped,
                prop: item.prop
              }
            },
            on: {
              input: (value) => {
                scoped.row[item.prop] = value
                // 获取子表单组件的数据
                const subformTableData = this.$refs[subformTableLayoutRefName].$children[0].getData()
                this.$set(config, 'defaultValue', subformTableData)
              }
            },
            nativeOn: {
              click: event => {
                event.stopPropagation()
              }
            },
          })
        ])
      }
    })
    return (
      <el-col
        span={config.span}
        style={config.span === 0 && { width: 'auto', display: 'block' }}
        class={className}
        nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}
      >
        <render
          ref={subformTableLayoutRefName}
          key={config.renderKey}
          conf={currentItem}
          scopedSlots={componentScopedSlots}
          onInput={(value) => {
            // 获取子表单组件的数据
            this.$set(config, 'defaultValue', value)
          }}
        >
        </render>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  }
}

function renderChildren(h, currentItem, index, list) {
  const config = currentItem.__config__
  if (!Array.isArray(config.children)) return null
  // const children = Array.isArray(config.action) ? config.children.concat(config.action) : config.children

  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout]

    if (layout) {

      return layout.call(this, h, el, i, config.children)
    }

    return layoutIsNotFound.call(this)
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.currentItem.__config__.layout}匹配的layout`)
}

export default {
  components: {
    render,
    draggable
  },
  props: [
    'currentItem',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  render(h) {
    const layout = layouts[this.currentItem.__config__.layout]
    if (layout) {
      return layout.call(this, h, this.currentItem, this.index, this.drawingList)
    }
    return layoutIsNotFound.call(this)
  }
}
</script>
