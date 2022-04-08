// 表单属性【右面板】
export const formConf = {
  formRef: 'elForm',
  formModel: 'formData',
  size: 'medium',
  labelPosition: 'right',
  labelWidth: 100,
  formRules: 'rules',
  gutter: 0,
  disabled: false,
  span: 24,
  formBtns: true,
  isForm: true
}

// 输入型组件 【左面板】
export const inputComponents = [
  {
    // 组件的自定义配置
    __config__: {
      label: '单行文本',
      panel: 'lx-input',
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 12,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: []
    },
    on: {
      'input': 'onInput',
      'change': 'onChange',
      'focus': 'onFocus',
      'blur': 'onBlur',
      'clear': 'onClear'
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    type: 'text',
    // 其余的为可直接写在组件标签上的属性
    placeholder: '请输入',
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: '多行文本',
      panel: 'lx-input',
      labelWidth: null,
      showLabel: true,
      tag: 'el-input',
      tagIcon: 'textarea',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 12,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/input'
    },
    on: {
      'input': 'onInput',
      'change': 'onChange',
      'focus': 'onFocus',
      'blur': 'onBlur',
      'clear': 'onClear'
    },
    type: 'textarea',
    placeholder: '请输入',
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: '密码',
      panel: 'lx-input',
      showLabel: true,
      labelWidth: null,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'password',
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 12,
      required: true,
      regList: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/input'
    },
    on: {
      'input': 'onInput',
      'change': 'onChange',
      'focus': 'onFocus',
      'blur': 'onBlur',
      'clear': 'onClear'
    },
    __slot__: {
      prepend: '',
      append: ''
    },
    type: 'password',
    placeholder: '请输入',
    'show-password': true,
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: '计数器',
      panel: 'lx-input-number',
      showLabel: true,
      changeTag: true,
      labelWidth: null,
      tag: 'el-input-number',
      tagIcon: 'number',
      defaultValue: undefined,
      span: 12,
      layout: 'colFormItem',
      required: true,
      regList: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/input-number'
    },
    on: {
      'change': 'onChange',
      'focus': 'onFocus',
      'blur': 'onBlur'
    },
    placeholder: '',
    min: undefined,
    max: undefined,
    step: 1,
    'step-strictly': false,
    precision: undefined,
    'controls-position': '',
    disabled: false
  },
  {
    __config__: {
      label: '编辑器',
      panel: 'lx-tinymce',
      showLabel: true,
      changeTag: true,
      labelWidth: null,
      tag: 'tinymce',
      tagIcon: 'rich-text',
      defaultValue: null,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      document: 'http://tinymce.ax-z.cn'
    },
    on: {
      'input': 'onInput',
      'focus': 'onFocus',
      'blur': 'onBlur'
    },
    placeholder: '请输入',
    height: 300, // 编辑器高度
    branding: false // 隐藏右下角品牌烙印
  }
]

// 选择型组件 【左面板】
export const selectComponents = [
  {
    __config__: {
      label: '下拉选择', // 表单标签名称
      showLabel: true, // 显示表单标签
      tooltips: '', // 提示信息
      labelWidth: null, // 表单标签宽度
      tag: 'object-selector', // 要渲染出的element组件名称
      tagIcon: 'select', // 左菜单面板的组件icon
      panel: 'lx-select', // 右属性面板配置的组件名称
      layout: 'colFormItem', // 布局
      span: 12, // 表格栅格
      required: false, // 是否必填
      dataType: 'static', // 数据类型
      url: 'https://www.fastmock.site/mock/3c316cb88d475a0308d2accca88494ed/lowcode/dynamic', // dataType是"dynamic"时, 请求的地址
      method: 'get', // dataType是"dynamic"时, 请求的方法
      dataPath: 'selectorList', // dataType是"dynamic"时，从请求里拿数据的目标
      defaultValue: '', // 默认值
      regList: []
    },
    on: {
      'input': 'onInput',
      'change': 'onChange',
      'focus': 'onFocus',
      'blur': 'onBlur',
      'clear': 'onClear',
      'visible-change': 'onVisibleChange',
      'remove-tag': 'onRemoveTag'
    },
    __slot__: {
      options: [{
        label: '选项一',
        id: '1'
      }, {
        label: '选项二',
        id: '2'
      }]
    },
    props: {
      props: { // 配置选项的label和value的属性名称
        label: 'label',
        value: 'id'
      }
    },
    placeholder: '请选择',
    clearable: true,
    disabled: false,
    filterable: false,
    multiple: false
  },
  {
    __config__: {
      label: '级联选择',
      showLabel: true,
      labelWidth: null,
      tag: 'object-cascader',
      tagIcon: 'cascader',
      panel: 'lx-cascader',
      layout: 'colFormItem',
      span: 12,
      required: false,
      dataType: 'static',
      url: 'https://www.fastmock.site/mock/3c316cb88d475a0308d2accca88494ed/lowcode/dynamic',
      method: 'get',
      dataPath: 'list',
      defaultValue: [],
      regList: []
    },
    on: {
      'input': 'onInput',
      'change': 'onChange',
      'focus': 'onFocus',
      'blur': 'onBlur',
      'visible-change': 'onVisibleChange',
      'expand-change': 'onExpandChange',
      'remove-tag': 'onRemoveTag'
    },
    options: [{
      id: 1,
      value: '1',
      label: '选项1',
      children: [{
        id: 2,
        value: '2',
        label: '选项1-1'
      }]
    }],
    props: {
      props: {
        multiple: false,
        label: 'label',
        value: 'id',
        children: 'children'
      }
    },
    placeholder: '请选择',
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
  },
  {
    __config__: {
      label: '单选框组',
      labelWidth: null,
      showLabel: true,
      tag: 'object-radio-group',
      tagIcon: 'radio',
      panel: 'lx-radio-group',
      layout: 'colFormItem',
      span: 12,
      required: false,
      optionType: 'default',
      border: false,
      dataType: 'static',
      defaultValue: '',
      regList: []
    },
    on: {
      'input': 'onInput',
      'change': 'onChange'
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: '1'
      }, {
        label: '选项二',
        value: '2'
      }]
    },
    props: {
      props: {
        label: 'label',
        value: 'value'
      }
    },
    size: 'medium',
    disabled: false
  },
  {
    __config__: {
      label: '多选框组',
      tag: 'object-checkbox-group',
      tagIcon: 'checkbox',
      panel: 'lx-radio-group',
      span: 12,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      optionType: 'default',
      required: false,
      border: false,
      dataType: 'static',
      defaultValue: [],
      regList: []

    },
    on: {
      'input': 'onInput',
      'change': 'onChange'
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: '1'
      }, {
        label: '选项二',
        value: '2'
      }]
    },
    props: {
      props: {
        label: 'label',
        value: 'value'
      }
    },
    size: 'medium',
    min: undefined, // 这里不能写null，会导致复选框无法勾选
    max: undefined,
    disabled: false
  },
  {
    __config__: {
      label: '开关',
      tag: 'el-switch',
      tagIcon: 'switch',
      panel: 'lx-switch',
      defaultValue: false,
      span: 12,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      required: false,
      regList: []
    },
    on: {
      'change': 'onChange'
    },
    disabled: false,
    'active-text': '',
    'inactive-text': '',
    'active-color': null,
    'inactive-color': null,
    'active-value': '开',
    'inactive-value': '关'
  },
  {
    __config__: {
      label: '滑块',
      tag: 'el-slider',
      tagIcon: 'slider',
      defaultValue: null,
      span: 12,
      panel: 'lx-slider',
      showLabel: true,
      tooltips: '',
      layout: 'colFormItem',
      labelWidth: null,
      required: false,
      regList: []
    },
    on: {
      'input': 'onInput',
      'change': 'onChange'
    },
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    'show-stops': false,
    range: false
  },
  {
    __config__: {
      label: '时间选择',
      tag: 'el-time-picker',
      tagIcon: 'time',
      defaultValue: null,
      span: 12,
      panel: 'lx-time-picker',
      layout: 'colFormItem',
      showLabel: true,
      labelWidth: null,
      required: false,
      regList: []
    },
    on: {
      'change': 'onChange',
      'focus': 'onFocus',
      'blur': 'onBlur'
    },
    'is-range': false,
    'picker-options': {
      selectableRange: '00:00:00 - 23:59:59'
    },
    placeholder: '请选择',
    disabled: false,
    clearable: true,
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
  },
  {
    __config__: {
      label: '时间范围',
      tag: 'time-range-picker',
      tagIcon: 'time-range',
      span: 12,
      panel: 'lx-time-picker',
      labelWidth: null,
      showLabel: true,
      tooltips: '',
      layout: 'colFormItem',
      defaultValue: null, // 这里只能为null，如果为数组会导致组件无法选时间
      required: false,
      regList: [],
    },
    on: {
      'change': 'onChange',
      'focus': 'onFocus',
      'blur': 'onBlur'
    },
    'is-range': true,
    disabled: false,
    clearable: true,
    'range-separator': '至',
    'start-placeholder': '开始时间',
    'end-placeholder': '结束时间',
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
  },
  {
    __config__: {
      label: '日期选择',
      tag: 'el-date-picker',
      tagIcon: 'date',
      panel: 'lx-date-picker',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 12,
      layout: 'colFormItem',
      required: false,
      regList: []
    },
    on: {
      'change': 'onChange',
      'focus': 'onFocus',
      'blur': 'onBlur'
    },
    placeholder: '请选择',
    type: 'date',
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      label: '日期范围',
      tag: 'date-range-picker',
      tagIcon: 'date-range',
      panel: 'lx-date-picker',
      defaultValue: [],
      span: 12,
      showLabel: true,
      labelWidth: null,
      tooltips: '',
      required: false,
      layout: 'colFormItem',
      regList: []
    },
    on: {
      'change': 'onChange',
      'focus': 'onFocus',
      'blur': 'onBlur'
    },
    type: 'daterange',
    'range-separator': '至',
    'start-placeholder': '开始日期',
    'end-placeholder': '结束日期',
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      label: '评分',
      tag: 'el-rate',
      tagIcon: 'rate',
      defaultValue: 0,
      span: 12,
      panel: 'lx-score',
      showLabel: true,
      labelWidth: null,
      tooltips: '',
      layout: 'colFormItem',
      required: false,
      regList: []
    },
    on: {
      'change': 'onChange'
    },
    max: 5,
    'allow-half': false,
    'show-text': false,
    'show-score': false,
    disabled: false
  },
  {
    __config__: {
      label: '颜色选择',
      tag: 'el-color-picker',
      tagIcon: 'color',
      panel: 'lx-color-picker',
      span: 12,
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      tooltips: '',
      layout: 'colFormItem',
      required: false,
      regList: []
    },
    on: {
      'change': 'onChange',
      'active-change': 'onActiveChange'
    },
    'show-alpha': false,
    'color-format': '',
    disabled: false,
    size: 'medium'
  },
  {
    __config__: {
      label: '上传',
      tag: 'file-upload',
      tagIcon: 'upload',
      panel: 'lx-upload',
      layout: 'colFormItem',
      defaultValue: '',
      showLabel: true,
      labelWidth: null,
      required: false,
      span: 12,
      showTip: false,
      buttonText: '点击上传',
      regList: [],
      fileSize: 10,
      sizeUnit: 'MB'
    },
    on: {
      'input': 'onInput',
      'change': 'onChange'
    },
    __slot__: {
      'list-type': true
    },
    action: '/upload/saveFile',
    disabled: false,
    accept: '',
    name: 'file',
    'list-type': 'text',
    multiple: false,
    limit: 1
  }
]

// 布局型组件 【左面板】
export const layoutComponents = [
  {
    __config__: {
      layout: 'rowFormItem',
      tagIcon: 'row',
      panel: 'lx-row',
      label: '行容器',
      layoutTree: true,
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/layout#row-attributes'
    }
  },
  {
    __config__: {
      label: '按钮',
      tag: 'event-button',
      tagIcon: 'button',
      panel: 'lx-button',
      span: 0,
      layout: 'native',
      document: 'https://element.eleme.cn/#/zh-CN/component/button'
    },
    __slot__: {
      default: '主要按钮'
    },
    type: 'primary',
    icon: 'el-icon-search',
    round: false,
    size: 'medium',
    plain: false,
    circle: false,
    disabled: false,
    styles: {
      defaultStyles: {
        marginTop: '8px',
        marginRight: '8px',
        marginBottom: '8px',
        marginLeft: '8px'
      }
    },
    eventSettings: {
      emit: ''
    }
  },
  {
    __config__: {
      label: 'HTML代码',
      tag: 'html-interpreter',
      tagIcon: 'code',
      panel: 'lx-html-interpreter',
      span: 24,
      layout: 'native'
    },
    content: '<div>HTML Text</div>'
  }
]

export const seniorComponents = [
  {
    __config__: {
      label: '部门选择1',
      showLabel: true,
      labelWidth: null,
      tag: 'department-selector-1',
      tagIcon: 'select',
      panel: 'lx-departmentSelector',
      layout: 'colFormItem',
      span: 12,
      required: false,
      dataType: 'dynamic',
      url: '/ims/department',
      method: 'get',
      dataPath: 'data',
      defaultValue: [],
      regList: []
    },
    on: {
      'input': 'onInput',
      'focus': 'onFocus'
    },
    options: [{
      id: 1,
      value: '1',
      name: '选项1',
      children: [{
        id: 2,
        value: '2',
        name: '选项1-1'
      }]
    }],
    props: {
      props: {
        multiple: false,
        label: 'name',
        value: 'id',
        children: 'children'
      }
    },
  },
  {
    __config__: {
      label: '部门选择2',
      showLabel: true,
      labelWidth: null,
      tag: 'department-selector-2',
      tagIcon: 'select',
      panel: 'lx-department-selector2',
      layout: 'colFormItem',
      span: 12,
      required: false,
      dataType: 'dynamic',
      url: '/ims/department',
      method: 'get',
      dataPath: 'data',
      defaultValue: [],
      regList: []
    },
    on: {
      'input': 'onInput',
      'focus': 'onFocus'
    },
    options: [], // 部门分类的选项组
    props: {
      props: {
        label: 'name',
        value: 'id'
      }
    },
  }
]

export const indexPageComponents =[
  {
		// 组件的自定义配置
		__config__: {
			label: '我的待办',
			panel: 'lx-my-backlog',
			tag: 'my-backlog',
			tagIcon: 'input',
			layout: 'native',
			span: 24
		},
    url: '/oa/task/todo',
	},
  {
    // 组件的自定义配置
    __config__: {
      label: '通知公告',
      labelWidth: null,
      showLabel: false,
      changeTag: false,
      tag: 'notice',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'native',
      span: 24,
      // document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
    },

  },
  {
    // 组件的自定义配置
    __config__: {
      label: '常用流程',
      labelWidth: null,
      showLabel: false,
      changeTag: false,
      tag: 'used-process',
      tagIcon: 'input',
      defaultValue: undefined,
      required: undefined,
      layout: 'native',
      span: 24,
    },

  },
  {
    // 组件的自定义配置
    __config__: {
      label: '多折线图',
      labelWidth: null,
      showLabel: false,
      changeTag: false,
      tag: 'stacked-line',
      tagIcon: 'input',
      defaultValue: undefined,
      required: undefined,
      layout: 'native',
      span: 24,
    },
  },
  {
    // 组件的自定义配置
    __config__: {
      label: '分组柱状图',
      labelWidth: null,
      showLabel: false,
      changeTag: false,
      tag: 'bar-base',
      tagIcon: 'input',
      defaultValue: undefined,
      required: undefined,
      layout: 'native',
      span: 24,
    },
  },

]

export const layoutPageComponents = [
  {
    // 组件的自定义配置
    __config__: {
      label: '横向导航条',
      panel: 'lx-page-container',
      tag: 'header-bar',
      tagIcon: 'input',
      defaultValue: undefined,
      layout: 'native',
      span: 24,
    },
  },
  {
    // 组件的自定义配置
    __config__: {
      label: '纵向导航条',
      panel: 'lx-nav-bar',
      tag: 'nav-bar',
      tagIcon: 'input',
      layout: 'native',
      span: 3
    }
  },
  {
    // 组件的自定义配置
    __config__: {
      label: '底部导航条',
      labelWidth: null,
      showLabel: false,
      changeTag: false,
      tag: 'footer-bar',
      tagIcon: 'input',
      defaultValue: undefined,
      required: undefined,
      layout: 'native',
      span: 24
    }
  },
  {
    __config__: {
      label: '页面容器',
      panel: 'lx-page-container',
      tag: 'page-container',
      tagIcon: 'row',
      span: 21,
      layout: 'native'
    }
  }
]

export const formModelComponents = [
  {
    __config__: {
      label: '表单容器',
      panel: 'lx-page-container',
      tag: 'form-container',
      tagIcon: 'row',
      span: 24,
      layout: 'parse',
    },
    url: '' // 请求接口
  },
  {
    __config__: {
      layout: 'rowFormItem',
      tagIcon: 'row',
      label: '行容器',
      layoutTree: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/layout#row-attributes'
    },
    type: 'default',
    justify: 'start',
    align: 'top'
  },
  {
    __config__: {
      label: '按钮',
      tag: 'event-button',
      tagIcon: 'button',
      panel: 'lx-button',
      span: 0,
      layout: 'native',
      document: 'https://element.eleme.cn/#/zh-CN/component/button'
    },
    __slot__: {
      default: '主要按钮'
    },
    type: 'primary',
    icon: 'el-icon-search',
    round: false,
    size: 'medium',
    plain: false,
    circle: false,
    disabled: false,
    styles: {
      defaultStyles: {
        marginTop: '8px',
        marginRight: '8px',
        marginBottom: '8px',
        marginLeft: '8px'
      }
    },
    eventSettings: {
      emit: ''
    }
  },
  {
    __config__: {
      label: '保存',
      tag: 'event-button',
      tagIcon: 'button',
      panel: 'lx-button',
      span: 0,
      layout: 'native',
      document: 'https://element.eleme.cn/#/zh-CN/component/button'
    },
    "__slot__": {
      "default": "保存"
    },
    type: 'primary',
    functionButton:true,//判断是否是具体功能按钮
    icon: 'el-icon-circle-check',
    round: false,
    size: 'medium',
    plain: false,
    circle: false,
    disabled: false,
    styles: {
      defaultStyles: {
        marginTop: '8px',
        marginRight: '8px',
        marginBottom: '8px',
        marginLeft: '8px'
      }
    },
    eventSettings: {
      emit: 'buttonEmitSave'
    }
  },
  {
    __config__: {
      label: '提交',
      tag: 'event-button',
      tagIcon: 'button',
      panel: 'lx-button',
      span: 0,
      layout: 'native',
      document: 'https://element.eleme.cn/#/zh-CN/component/button'
    },
    "__slot__": {
      "default": "提交"
    },
    type: 'primary',
    functionButton:true,
    icon: 'el-icon-folder-checked',
    round: false,
    size: 'medium',
    plain: false,
    circle: false,
    disabled: false,
    styles: {
      defaultStyles: {
        marginTop: '8px',
        marginRight: '8px',
        marginBottom: '8px',
        marginLeft: '8px'
      }
    },
    eventSettings: {
      emit: 'buttonEmitSubmit'
    }
  },
  {
    __config__: {
      label: '关闭', 
      tag: 'event-button',
      tagIcon: 'button',
      panel: 'lx-button',
      span: 0,  
      layout: 'native',
      document: 'https://element.eleme.cn/#/zh-CN/component/button'
    },
    "__slot__": {
      "default": "关闭"
    },
    functionButton:true,
    type: 'default',
    icon: 'el-icon-close',
    round: false,
    size: 'medium',
    plain: false,
    circle: false,
    disabled: false,
    styles: {
      defaultStyles: {
        marginTop: '8px',
        marginRight: '8px',
        marginBottom: '8px',
        marginLeft: '8px'
      }
    },
    eventSettings: {
      emit: 'buttonEmitClose'
    }
  }
]

export const listModelComponnets = [
  {
    __config__: {
      label: '列表容器',
      panel: 'lx-page-container',
      tag: 'list-container',
      tagIcon: 'row',
      span: 24,
      layout: 'native',
    },
    url: '' // 请求接口
  },
]