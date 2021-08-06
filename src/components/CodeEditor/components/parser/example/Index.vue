<template>
	<div class="test-form">
		<parser :form-conf="formConf" @submit="sumbitForm1" />
		<parser :key="key2" :form-conf="formConf" @submit="sumbitForm2" />
		<el-button @click="change">
			change
		</el-button>
	</div>
</template>

<script>
import Parser from '../Parser'

// 若parser是通过安装npm方式集成到项目中的，使用此行引入
// import Parser from 'form-gen-parser'

export default {
	components: {
		Parser
	},
	props: {},
	data() {
		return {
			key2: +new Date(),
			formConf: {
				"fields": [
            {
                "__config__": {
                    "label": "滑块",
                    "tag": "el-slider",
                    "tagIcon": "slider",
                    "defaultValue": 0,
                    "span": 24,
                    "showLabel": true,
                    "layout": "colFormItem",
                    "labelWidth": null,
                    "required": true,
                    "regList": [],
                    "changeTag": true,
                    "show": true,
                    "document": "https://element.eleme.cn/#/zh-CN/component/slider",
                    "formId": 8754,
                    "renderKey": "87541626338443409"
                },
                "disabled": false,
                "min": 0,
                "max": 100,
                "step": 1,
                "show-stops": false,
                "range": false,
                "__vModel__": "field8754"
            },
            {
                "__config__": {
                    "label": "时间范围",
                    "tag": "el-time-picker",
                    "tagIcon": "time-range",
                    "span": 24,
                    "showLabel": true,
                    "labelWidth": null,
                    "layout": "colFormItem",
                    "defaultValue": null,
                    "required": true,
                    "regList": [],
                    "changeTag": true,
                    "show": true,
                    "document": "https://element.eleme.cn/#/zh-CN/component/time-picker",
                    "formId": 8755,
                    "renderKey": "87551626338444273"
                },
                "style": {
                    "width": "100%"
                },
                "disabled": false,
                "clearable": true,
                "is-range": true,
                "range-separator": "至",
                "start-placeholder": "开始时间",
                "end-placeholder": "结束时间",
                "format": "HH:mm:ss",
                "value-format": "HH:mm:ss",
                "__vModel__": "field8755"
            },
            {
                "__config__": {
                    "label": "时间选择",
                    "tag": "el-time-picker",
                    "tagIcon": "time",
                    "defaultValue": null,
                    "span": 24,
                    "showLabel": true,
                    "layout": "colFormItem",
                    "labelWidth": null,
                    "required": true,
                    "regList": [],
                    "changeTag": true,
                    "show": true,
                    "document": "https://element.eleme.cn/#/zh-CN/component/time-picker",
                    "formId": 8756,
                    "renderKey": "87561626338445106"
                },
                "placeholder": "请选择时间选择",
                "style": {
                    "width": "100%"
                },
                "disabled": false,
                "clearable": true,
                "picker-options": {
                    "selectableRange": "00:00:00-23:59:59"
                },
                "format": "HH:mm:ss",
                "value-format": "HH:mm:ss",
                "__vModel__": "field8756"
            }
        ],
        "formRef": "elForm",
        "formModel": "formData123",
        "size": "medium",
        "labelPosition": "right",
        "labelWidth": 100,
        "formRules": "rules",
        "gutter": 15,
        "disabled": false,
        "span": 24,
        "formBtns": true
			},
			formConf2: {
				fields: [
					{
						__config__: {
							label: '单行文本',
							labelWidth: null,
							showLabel: true,
							changeTag: true,
							tag: 'el-input',
							tagIcon: 'input',
							required: true,
							layout: 'colFormItem',
							span: 24,
							document: 'https://element.eleme.cn/#/zh-CN/component/input',
							regList: [
								{
									pattern: '/^1(3|4|5|7|8|9)\\d{9}$/',
									message: '手机号格式错误'
								}
							]
						},
						__slot__: {
							prepend: '',
							append: ''
						},
						__vModel__: 'mobile',
						placeholder: '请输入手机号',
						style: {
							width: '100%'
						},
						clearable: true,
						'prefix-icon': 'el-icon-mobile',
						'suffix-icon': '',
						maxlength: 11,
						'show-word-limit': true,
						readonly: false,
						disabled: false
					},
					{
						__config__: {
							label: '日期范围',
							tag: 'el-date-picker',
							tagIcon: 'date-range',
							defaultValue: null,
							span: 24,
							showLabel: true,
							labelWidth: null,
							required: true,
							layout: 'colFormItem',
							regList: [],
							changeTag: true,
							document:
                'https://element.eleme.cn/#/zh-CN/component/date-picker',
							formId: 101,
							renderKey: 1585980082729
						},
						style: {
							width: '100%'
						},
						type: 'daterange',
						'range-separator': '至',
						'start-placeholder': '开始日期',
						'end-placeholder': '结束日期',
						disabled: false,
						clearable: true,
						format: 'yyyy-MM-dd',
						'value-format': 'yyyy-MM-dd',
						readonly: false,
						__vModel__: 'field101'
					}
				],
				formRef: 'elForm',
				formModel: 'formData',
				size: 'small',
				labelPosition: 'right',
				labelWidth: 100,
				formRules: 'rules',
				gutter: 15,
				disabled: false,
				span: 24,
				formBtns: true,
				unFocusedComponentBorder: false
			}
		}
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {
		// 表单数据回填，模拟异步请求场景
		setTimeout(() => {
			// 请求回来的表单数据
			const data = {
				mobile: '18836662555'
			}
			// 回填数据
			this.fillFormData(this.formConf, data)
			// 更新表单
			this.key2 = +new Date()
		}, 2000)
	},
	methods: {
		fillFormData(form, data) {
			form.fields.forEach(item => {
				const val = data[item.__vModel__]
				if (val) {
					item.__config__.defaultValue = val
				}
			})
		},
		change() {
			this.key2 = +new Date()
			const t = this.formConf
			this.formConf = this.formConf2
			this.formConf2 = t
		},
		sumbitForm1(data) {
			console.log('sumbitForm1提交数据：', data)
		},
		sumbitForm2(data) {
			console.log('sumbitForm2提交数据：', data)
		}
	}
}
</script>

<style lang="scss" scoped>
.test-form {
	margin: 15px auto;
	padding: 15px;
	width: 800px;
}
</style>
