<script>
import { deepClone } from "../../utils/index";
import render from "../render/render.js";
import { addAllNodesStyleToDocument } from './addStyleToDocument.js'
import { getLabels } from './addLabels.js'

const layouts = {
  // 所有表单类填写组件用此布局
  colFormItem(h, scheme) {
    const config = scheme.__config__;
    const listeners = buildListeners.call(this, scheme);
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = "0";
    const getNode = () => {
      if (!this.readOnly) {
        return <render conf={scheme} on={listeners}></render>
      } else {
        return <div>{getLabels.call(this.editData, h, scheme.__config__.defaultValue, scheme)}</div>
      }
    }
    return (
      <el-col v-show={!config.hidden} span={config.span} style={config.span === 0 && { width: 'auto', display: 'block' }}>
        <el-form-item
          label-width={labelWidth} 
          label={config.showLabel ? config.label : ''}
          prop={scheme.__vModel__}
        >
          {getNode()}
        </el-form-item>
      </el-col>
    );
  },
  // 行容器组件用此布局
  rowFormItem(h, scheme) {
    let child = renderChildren.apply(this, arguments);
    const config = scheme.__config__
    if (scheme.type === "flex") {
      child = (
        <el-row
          type={scheme.type}
          justify={scheme.justify}
          align={scheme.align}
        >
          {child}
        </el-row>
      );
    }
    return (
      <el-col v-show={!config.hidden} span={scheme.span}>
        <el-row gutter={scheme.gutter}>
          <div class={'drag-wrapper flex-start-wrap component-style-panel-' + config.formId}>
            {child}
          </div>
        </el-row>
      </el-col>
    );
  },
  // 自定义组件如表格、文本等用此布局
  native (h, scheme) {
    const config = scheme.__config__
    const listeners = {
      nativeClick: callback => {
        callback(this.$refs.formContainerRef)
      }
    }
    return (
      <el-col v-show={!config.hidden} span={config.span} style={config.span === 0 && { width: 'auto', display: 'block' }}>
        <render conf={scheme} on={listeners}></render>
      </el-col>
    )
  },
  // 表单容器用此布局
  parse(h, scheme) {
    const config = scheme.__config__;
    return (
      <el-col v-show={!config.hidden} span={config.span}>
        <form-container ref="formContainerRef" url={scheme.url}></form-container>
      </el-col>
    )
  },
  // 表格布局
  table(h, scheme) {

  }
};

function renderFrom(h) {
  const { formConfCopy } = this;

  if (formConfCopy && !formConfCopy.isForm) {
    return (
      <el-row>
        <div style="height:100%">{renderFormItem.call(this, h, formConfCopy.fields)}</div>
      </el-row>
    )
  } else {
    return (
      <el-row gutter={formConfCopy.gutter}>
        <el-form
          size={formConfCopy.size}
          label-position={formConfCopy.labelPosition}
          disabled={formConfCopy.disabled}
          label-width={`${formConfCopy.labelWidth}px`}
          ref={formConfCopy.formRef}
          // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
          props={{ model: this[formConfCopy.formModel] }}
          rules={this[formConfCopy.formRules]}
        >
          {renderFormItem.call(this, h, formConfCopy.fields)}
          {formConfCopy.formBtns && formBtns.call(this, h)}
        </el-form>
      </el-row>
    );
  }
}

function formBtns(h) {
  const { showSubmit } = this;

  return (
    <el-col v-show={showSubmit}>
      <el-form-item size="large">
        <el-button type="primary" onClick={this.submitForm}>
          提交
        </el-button>
        <el-button onClick={this.resetForm}>重置</el-button>
      </el-form-item>
    </el-col>
  );
}

function renderFormItem(h, elementList) {
  return elementList.map(scheme => {
    const config = scheme.__config__;
    const layout = layouts[config.layout];

    if (layout) {
      return layout.call(this, h, scheme);
    }
    throw new Error(`没有与${config.layout}匹配的layout`);
  });
}

function renderChildren(h, scheme) {
  const config = scheme.__config__;
  if (!Array.isArray(config.children)) return null;
  return renderFormItem.call(this, h, config.children);
}

function setValue(event, config, scheme) {
  this.$set(config, "defaultValue", event);
  this.$set(this[this.formConf.formModel], scheme.__vModel__, event);
}

function buildListeners(scheme) {
  const config = scheme.__config__;
  const methods = scheme.__methods__ || {};
  const listeners = {};

  // 给__methods__中的方法绑定this和event
  Object.keys(methods).forEach(key => {
    let currentMethod = methods[key]
    if (typeof methods[key] === 'string') {
      currentMethod = new Function('value', currentMethod)
    }
    listeners[key] = event => {
      // console.log(key + '事件被执行了--Parser');
      currentMethod.call(this, event);
    }
  });
  // 响应 render.js 中的 vModel $emit('input', val)
  listeners.input = event => {
    setValue.call(this, event, config, scheme)
    // input事件被重写 所以要把原来自定义的onInput加上
    if (methods.onInput && typeof methods.onInput === 'string') {
      const met = new Function('value', methods.onInput)
      met.call(this, event);
    }
  }
  return listeners;
}

export default {
  components: {
    render
  },
  props: {
    formConf: {
      type: Object,
      required: true
    },
    editData: {
      type: Object,
      default: null
    },
    showSubmit: {
      type: Boolean,
      required: true
    },
    readOnly: Boolean
  },

  data() {
    const data = {
      formConfCopy: deepClone(this.formConf),
      [this.formConf.formModel]: {},
      [this.formConf.formRules]: {},
      renderKey: ''
    };

    this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules]);
    this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel]);
    return data;
  },
  mounted() {},
  methods: {
    initFormData(componentList, formData) {
      componentList.forEach(cur => {
        const config = cur.__config__;
        if (cur.__vModel__) {
          if (this.editData) {
            config.defaultValue = this.editData[cur.__vModel__];
          }
          formData[cur.__vModel__] = config.defaultValue;
        }
        if (config.children) this.initFormData(config.children, formData);
      });
      addAllNodesStyleToDocument(componentList)
      // 将editData中没有被vModel用到的属性都合并到formData中
      Object.assign(formData, this.editData)
    },
    buildRules (componentList, rules) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (Array.isArray(config.regList)) {
          if (config.required !== undefined) { // 只要required存在不管true还是false都要给个校验对象，为后续动态取消必填做准备，而且required对象必须在第一个
            const required = { required: config.required, message: cur.placeholder }
            if (Array.isArray(config.defaultValue)) {
              required.type = 'array'
            }
            required.message === undefined && (required.message = `${config.label}不能为空`)
            config.regList.push(required)
          }
          // 其他正则校验添加
          rules[cur.__vModel__] = config.regList.map(item => {
            // eslint-disable-next-line no-eval
            item.pattern && (item.pattern = eval(item.pattern))
            return item
          })
        }
        if (config.children) this.buildRules(config.children, rules)
      })
    },
    resetForm() {
      this.formConfCopy = deepClone(this.formConf);
      this.$refs[this.formConf.formRef].resetFields();
    },
    submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs[this.formConf.formRef].validate(valid => {
          if (valid) {
            if (this.showSubmit) {
              this.$emit("submit", this[this.formConf.formModel]); // 触发sumit事件
            }
            resolve(this[this.formConf.formModel]);
          } else {
            this.msgError('表单校验不通过')
            reject(new Error('表单校验不通过'))
          }
        });
      });
    },
    // 找到字段对应的配置对象
    recursion (field, callback) {
      let target = null
      const recursion = list => {
        for (let item of list) {
          if (item.__vModel__ === field) {
            target = item
            break
          }
          if (item.children && item.children.length) {
            recursion(item.children)
          }
        }
      }
      recursion(this.formConfCopy.fields)
      if (target) {
        callback && callback(target)
        target.__config__.renderKey = String(new Date().getTime())
      } else {
        console.error(`目标字段${field}不存在`);
      }
    },
    // 获取值
    getValue (field) {
      return this[this.formConf.formModel][field]
    },
    // 设置值
    setValue (field, value) {
      this.setOption(field, '__config__.defaultValue', value)
      this[this.formConf.formModel][field] = value
    },
    // 设置禁用
    setDisabled (field, value = true) {
      this.setOption(field, 'disabled', value)
    },
    // 设置只读
    setReadOnly (field, value = true) {
      this.setOption(field, 'readonly', value)
    },
    // 设置隐藏
    setHidden (field, value = true) {
      this.setOption(field, '__config__.hidden', value)
    },
    // 设置必填
    setRequired (field, value = true) {
      this.recursion(field, () => {
        this[this.formConf.formRules][field][0].required = value
      })
    },
    // 设置指定属性值
    setOption (field, key, value) {
      this.recursion(field, target => {
        const keyArr = key.split('.')
        keyArr.reduce((total, current, index) => {
          if (index === keyArr.length - 1) {
            this.$set(total, current, value)
          } else if (total[current] === undefined) {
            this.$set(total, current, {})
          }
          return total[current]
        }, target)
      })
    }
  },
  render(h) {
    return renderFrom.call(this, h);
  }
};
</script>
