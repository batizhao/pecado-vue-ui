import { deepClone } from '../../utils/index'

const componentChild = {}
/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const slotsFiles = require.context('./slots', false, /\.js$/)
const keys = slotsFiles.keys() || []
keys.forEach(key => {
	const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
	const value = slotsFiles(key).default
	componentChild[tag] = value
})

function vModel(dataObject, defaultValue) {
	dataObject.props.value = defaultValue
	dataObject.on.input = val => {
		this.$emit('input', val)
	}
}

function mountSlotFiles(h, confClone, children) {
	const childObjs = componentChild[confClone.__config__.tag]
	if (childObjs) {
		Object.keys(childObjs).forEach(key => {
			const childFunc = childObjs[key]
			if (confClone.__slot__ && confClone.__slot__[key]) {
				children.push(childFunc(h, confClone, key))
			}
		})
	}
}

function emitEvents(confClone) {
	['on', 'nativeOn'].forEach(attr => {
		const eventKeyList = Object.keys(confClone[attr] || {})
		eventKeyList.forEach(key => {
			const val = confClone[attr][key]
			if (typeof val === 'string') {
				confClone[attr][key] = event => this.$emit(val, event)
			}
		})
	})
}

function buildDataObject(confClone, dataObject) {
	Object.keys(confClone).forEach(key => {
		// 暂时先给所有组件绑定个click事件
		dataObject.on.nativeClick = val => {
			this.$emit('nativeClick', val)
		}
		// 给每个组件添加class，用于样式面板添加样式
		const styleSheets = confClone.__config__.styleSheets ? confClone.__config__.styleSheets.join(' ') : ''
		dataObject.class = `component-style-panel-${confClone.__config__.formId} ${styleSheets}`
		
		const val = confClone[key]
		if (key === '__vModel__') {
			vModel.call(this, dataObject, this.subformTableDefaultValue === undefined ? confClone.__config__.defaultValue : this.subformTableDefaultValue.scoped.row[this.subformTableDefaultValue.prop])
		} else if (dataObject[key] !== undefined) {
			if (dataObject[key] === null
        || dataObject[key] instanceof RegExp
        || ['boolean', 'string', 'number', 'function'].includes(typeof dataObject[key])) {
				dataObject[key] = val
			} else if (Array.isArray(dataObject[key])) {
				dataObject[key] = [...dataObject[key], ...val]
			} else {
				dataObject[key] = { ...dataObject[key], ...val }
			}
		} else {
			dataObject.attrs[key] = val
		}
	})
	dataObject.scopedSlots = this.$scopedSlots
	// 清理属性
	clearAttrs(dataObject)
}

function clearAttrs(dataObject) {
	const tag = dataObject.attrs.__config__.tag
	// 在进行二次封装下拉框时，要用到__config__中的配置，要把他传入组件
  if (!['object-selector', 'file-upload', 'object-cascader', 'department-selector-1', 'department-selector-2', 'subform-table'].includes(tag)) {
    delete dataObject.attrs.__config__
  }
  if (!['object-selector', 'object-checkbox-group', 'object-radio-group'].includes(tag)) {
    delete dataObject.attrs.__slot__
  }
	delete dataObject.attrs.__methods__
}

function makeDataObject() {
	// 深入数据对象：
	// https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
	return {
		class: {},
		attrs: {},
		props: {},
		domProps: {},
		nativeOn: {},
		on: {},
		style: {},
		directives: [],
		scopedSlots: {},
		slot: null,
		key: null,
		ref: null,
		refInFor: true
	}
}

export default {
	props: {
		conf: {
			type: Object,
			required: true
		},
		subformTableDefaultValue: {
			type: Object
		}
	},
	render(h) {
		const dataObject = makeDataObject()
		// this.conf.columns = this.conf.__config__.columns ? deepClone(this.conf.__config__.columns) : []
		// console.log(this.conf.__config__.tag, this.conf, this.columns)
		const confClone = deepClone(this.conf)
		const children = this.$slots.default || []

		// 如果slots文件夹存在与当前tag同名的文件，则执行文件中的代码
		mountSlotFiles.call(this, h, confClone, children)

		// 将字符串类型的事件，发送为消息
		emitEvents.call(this, confClone)

		// 将json表单配置转化为vue render可以识别的 “数据对象（dataObject）”
		buildDataObject.call(this, confClone, dataObject)

		return h(this.conf.__config__.tag, dataObject, children)
	}
}
