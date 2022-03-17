<template>
  <div>
    <action-form
      :model="form"
      :formOptions="formOptions"
      label-width="120px"
      ref="actionFormRef"
      :span="12"
    >
      <template slot="icon">
        <el-input v-model="form.icon">
          <el-button slot="append" icon="el-icon-search" @click="$refs.fontAwesomeSelectorRef.open()"></el-button>
        </el-input>
        <font-awesome-selector ref="fontAwesomeSelectorRef" v-model="form.icon"></font-awesome-selector>
      </template>
    </action-form>
  </div>
</template>
<script>
import { listDashboardMenu } from "@/api/ims/menu";
import { getListData } from "@/api/app/formModel";
import { getListData as getListModelData } from "@/api/app/pageModel.js";
import { getListData as getPageModelList } from '@/api/dp/page/model.js'
import FontAwesomeSelector from '@/components/FontAwesomeSelector/index.vue'
const getDefaultFrom = () => {
  return {
    pid: 0,
    type: 'M',
    icon: '',
    name: '',
    sort: 0,
    path: '',
    permission: '',
    description: '',
    appPageCode: '',
    pageModelCode: '',

    currentAppPageType: ''
  }
}
export default {
  components: {
    FontAwesomeSelector
  },
  props: {
    appId: [Number, String]
  },
  data () {
    return {
      form: getDefaultFrom(),
      formOptions: [
        {
          label: '上级菜单',
          prop: 'pid',
          type: 'treeSelect',
          options: [],
          optionsProps: {
            value: 'id',
            label: 'name',
            children: 'children'
          },
          rules: [
            { required: true, message: "上级菜单不能为空", trigger: "change" },
          ]
        },
        {
          label: '菜单名称',
          prop: 'name',
          rules: [
            { required: true, message: "菜单名称不能为空", trigger: "change" },
          ]
        },
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
            this.form.currentAppPageType = target ? target.type : ''
            this.form.pageModelCode = ''
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
            return this.form.currentAppPageType === 'form'
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
            return this.form.currentAppPageType === 'list'
          }
        },
        {
          label: '菜单类型',
          prop: 'type',
          type: 'radio',
          options: [
            { value: 'M', label: '菜单' },
            { value: 'B', label: '按钮' }
          ],
          rules: [
            { required: true }
          ]
        },
        {
          label: '菜单图标',
          prop: 'icon',
          type: 'slot',
          slotName: 'icon',
          showCondition (model) {
            return model.type === 'M'
          }
        },
        {
          label: '路由地址',
          prop: 'path',
          showCondition (model) {
            return model.type === 'M'
          }
        },
        {
          label: '显示排序',
          prop: 'sort',
          type: 'inputNumber',
          rules: [
            { required: true, message: "显示顺序不能为空", trigger: "change" },
          ]
        },
        {
          label: '权限标识',
          prop: 'permission',
        },
        {
          label: '菜单说明',
          prop: 'description',
        }
      ]
    }
  },
  created () {
    // 获取上级菜单
    listDashboardMenu().then(res => {
      const options = [
        {
          name: '根节点',
          id: 0,
          children: res.data
        }
      ]
      const index = this.formOptions.findIndex(item => item.prop === 'pid')
      this.formOptions[index].options = options
    })
    // 获取表单模型
    getListData(this.appId).then(res => {
      const index = this.formOptions.findIndex(item => item.label === '表单模型')
      this.formOptions[index].options = res.data.records
    })
    // 获取列表模型
    getListModelData(this.appId).then(res => {
      const index = this.formOptions.findIndex(item => item.label === '列表模型')
      this.formOptions[index].options = res.data.records
    })
    // 获取页面模型类型
    getPageModelList().then(res => {
      let list = res.data.records || []
      list = list.filter(item => {
        return item.type !== 'layout'
      })
      // 排除布局模型
      const index = this.formOptions.findIndex(item => item.prop === 'appPageCode')
      this.formOptions[index].options = list

      // 通过form.appPageCode值判断currentAppPageType的值
      const target = list.find(item => item.id === this.form.appPageCode)
      if (target) this.form.currentAppPageType = target.type
      
    })

  },
  methods: {
    submit () {
      let data = null
      const form = this.$refs.actionFormRef.getRef()
      form.validate(valid => {
        if (valid) {
          data = this.form
        }
      })
      return data
    },
    reset () {
      this.$refs.actionFormRef.reset()
      this.form = getDefaultFrom()
    }
  }
}
</script>