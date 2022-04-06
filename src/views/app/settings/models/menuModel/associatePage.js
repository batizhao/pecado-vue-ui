// 封装关联页面所需的表单元素，其他地方也会要用到
import { getListData } from "@/api/app/formModel";
import { getListData as getListModelData } from "@/api/app/pageModel.js";
import { getListData as getPageModelList } from '@/api/dp/page/model.js'

export function getAssociatePageOption (modelName) {
  return [
    {
      label: '页面模型',
      prop: 'appPageCode',
      type: 'select',
      options: [],
      optionsProps: {
        label: 'name',
        value: 'id'
      },
      change: (value, item) => {
        const target = item.options.find(t => t.id === value)
        this[modelName].currentAppPageType = target ? target.type : ''
        this[modelName].pageModelCode = ''
      }
    },
    {
      label: '表单模型',
      prop: 'pageModelCode',
      type: 'select',
      options: [],
      optionsProps: {
        label: 'name',
        value: 'formKey'
      },
      rules: [
        { required: true, message: "表单模型不能为空", trigger: "change" }
      ],
      showCondition: () => {
        return this[modelName].currentAppPageType === 'form'
      }
    },
    {
      label: '列表模型',
      prop: 'pageModelCode',
      type: 'select',
      options: [],
      optionsProps: {
        label: 'name',
        value: 'code'
      },
      rules: [
        { required: true, message: "列表模型不能为空", trigger: "change" }
      ],
      showCondition: () => {
        return this[modelName].currentAppPageType === 'list'
      }
    },
  ]
}

export function getAssociatePageDataList (modelName, formOptionsName) {
  // 获取表单模型
  getListData(this.appId).then(res => {
    const index = this[formOptionsName].findIndex(item => item.label === '表单模型')
    this[formOptionsName][index].options = res.data.records
  })
  // 获取列表模型
  getListModelData(this.appId).then(res => {
    const index = this[formOptionsName].findIndex(item => item.label === '列表模型')
    this[formOptionsName][index].options = res.data.records
  })
  // 获取页面模型类型
  getPageModelList().then(res => {
    let list = res.data.records || []
    list = list.filter(item => {
      // 排除布局模型
      return item.type !== 'layout'
    })
    const index = this[formOptionsName].findIndex(item => item.prop === 'appPageCode')
    this[formOptionsName][index].options = list

    getCurrentAppPageType.call(this, modelName, formOptionsName)
  })
}

export function getCurrentAppPageType (modelName, formOptionsName) {
  const index = this[formOptionsName].findIndex(item => item.prop === 'appPageCode')
  const list = this[formOptionsName][index].options
  // 通过form.appPageCode值判断currentAppPageType的值
  const target = list.find(item => item.id === this[modelName].appPageCode)
  this[modelName].currentAppPageType = target ? target.type : ''
}